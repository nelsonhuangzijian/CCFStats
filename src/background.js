importScripts('data/catalog.js','engine.js','resolver.js');
const CACHE_KEY='ccf-dblp-record-cache-v4',LIMIT_KEY='ccf-dblp-throttle-v2',DAY=86400000;
const cache=new Map(),pending=new Map(),cancelledClients=new Map(),queue=[];let pumping=false,cooldown=0,interval=2000,nextAt=0,consecutiveFailures=0,cooldownReason='rate_limited';
const ready=(async()=>{try{const [saved,limits,legacy]=await Promise.all([chrome.storage.local.get(CACHE_KEY),chrome.storage.local.get(LIMIT_KEY),chrome.storage.local.get('ccf-provider-cooldowns-v1')]);for(const [key,item] of saved[CACHE_KEY]?.entries||[])if(item.until>Date.now())cache.set(key,item);const limit=limits[LIMIT_KEY];if(limit?.reason==='service_cooldown')cooldownReason=limit.reason;if(Number.isFinite(limit?.failures))consecutiveFailures=Math.max(0,Math.min(2,limit.failures));if(Number.isFinite(limit?.until))cooldown=limit.until;for(const [provider,until] of legacy['ccf-provider-cooldowns-v1']||[])if(provider==='dblp'&&Number.isFinite(until))cooldown=Math.max(cooldown,until);if(Number.isFinite(limit?.interval))interval=Math.min(60000,Math.max(2000,limit.interval));}catch{}})();
const failure=code=>({ok:false,provider:'dblp',code});
const limited=()=>({...failure(cooldownReason),globalWait:true,retryAt:cooldown,retryAfter:Math.max(1,Math.ceil((cooldown-Date.now())/1000))});
async function persistLimits(){try{await chrome.storage.local.set({[LIMIT_KEY]:{until:cooldown,interval,reason:cooldownReason,failures:consecutiveFailures}});}catch{}}
async function trackFailure(value){
  if(value.ok){if(consecutiveFailures){consecutiveFailures=0;await persistLimits();}return value;}
  if(['server_error','timeout','network_or_cors','network'].includes(value.code)){
    consecutiveFailures++;
    if(consecutiveFailures>=3){consecutiveFailures=0;cooldown=Math.max(cooldown,Date.now()+60000);cooldownReason='service_cooldown';value={...value,globalWait:true,retryAt:cooldown,retryAfter:Math.ceil((cooldown-Date.now())/1000)};}
    await persistLimits();
  }return value;
}
async function access(){try{return await chrome.permissions.contains({origins:['https://dblp.org/*']})?null:failure('missing_host_permission');}catch{return failure('permission_check_failed');}}
function paperKey(p){const key=[CCF_RESOLVER.titleKey(p.title),String(p.year),CCF_ENGINE.person(p.firstAuthor)];if(CCF_RESOLVER.venueHints(p).length)key.push(CCF_ENGINE.venueKey(p.venue));return JSON.stringify(key);}
function cachedValue(key,paper){const item=cache.get(key);if(!item||item.until<=Date.now())return null;if(paper&&item.record&&!CCF_RESOLVER.recordCompatible(item.record,paper)){cache.delete(key);return null;}return {ok:true,provider:'dblp',...CCF_RESOLVER.classifyRecord(item.record),cached:true,until:item.until};}
async function persist(){while(cache.size>1500||JSON.stringify([...cache]).length>3000000)cache.delete(cache.keys().next().value);try{await chrome.storage.local.set({[CACHE_KEY]:{entries:[...cache]}});}catch{}}
async function fetchPaper(item){
  const denied=await access();if(denied)return denied;if(item.cancelled||!item.consumers.length)return failure('cancelled');
  const author=CCF_ENGINE.person(item.paper.firstAuthor).split(' ').at(-1),url=new URL('https://dblp.org/search/publ/api');
  url.search=new URLSearchParams({q:item.paper.title+' author:'+author,format:'json',app:'CCFStatistics_Scholar_1.0.0'}).toString();
  const controller=new AbortController();item.controller=controller;const timer=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch(url.href,{signal:controller.signal,credentials:'omit',redirect:'error',headers:{Accept:'application/json'}});
    if(!response.ok){
      if(response.status===429){const header=response.headers?.get('Retry-After'),seconds=Number(header),until=header&&Number.isFinite(seconds)?Date.now()+Math.max(0,seconds)*1000:Date.parse(header);interval=Math.min(60000,Math.max(4000,interval*2));cooldown=Number.isFinite(until)?Math.max(Date.now()+1000,until):Date.now()+60000;cooldownReason='rate_limited';consecutiveFailures=0;await persistLimits();return limited();}
      return {...failure(response.status===403?'forbidden':response.status>=500?'server_error':'http_error'),status:response.status};
    }
    let payload;try{payload=await response.json();}catch(error){if(error.name==='AbortError')throw error;return failure('invalid_response');}
    let record,result;try{record=CCF_RESOLVER.selectRecord(payload,item.paper);result=CCF_RESOLVER.classifyRecord(record);}catch{return failure('invalid_response');}
    const positive=result.state==='ranked'||result.state==='non_ccf',until=Date.now()+(positive?90*DAY:DAY);
    cache.set(item.key,{record,until});await persist();return {ok:true,provider:'dblp',...result,until};
  }catch(error){return failure(error.name==='AbortError'?(item.cancelled?'cancelled':'timeout'):'network_or_cors');}
  finally{clearTimeout(timer);item.controller=null;}
}
async function pump(){
  if(pumping)return;pumping=true;
  try{while(queue.length){
    queue.sort((a,b)=>Number(b.consumers.some(c=>c.mode==='statistics'))-Number(a.consumers.some(c=>c.mode==='statistics')));
    const item=queue.shift();if(!item.consumers.length){if(pending.get(item.key)===item)pending.delete(item.key);continue;}
    let value=cachedValue(item.key,item.paper);
    if(!value){if(cooldown>Date.now())value=limited();else{
      while(nextAt>Date.now()&&item.consumers.length){await new Promise(r=>setTimeout(r,Math.min(15000,nextAt-Date.now())));const denied=await access();if(denied){value=denied;break;}}
      if(!item.consumers.length){if(pending.get(item.key)===item)pending.delete(item.key);continue;}
      if(!value){
        if(queue.some(q=>q.consumers.some(c=>c.mode==='statistics'))&&!item.consumers.some(c=>c.mode==='statistics')){queue.push(item);continue;}
        if(cooldown>Date.now())value=limited();else{item.started=true;nextAt=Date.now()+interval;value=await trackFailure(await fetchPaper(item));}
      }
    }}
    if(pending.get(item.key)===item)pending.delete(item.key);for(const consumer of item.consumers){try{consumer.respond(value);}catch{}}item.consumers=[];
  }}finally{pumping=false;}
}
function allowedSender(sender){try{const u=new URL(sender.url||'');return u.protocol==='https:'&&/^scholar\.google\.(?:com|com\.[a-z]{2}|co\.[a-z]{2}|[a-z]{2,3})$/.test(u.hostname)&&u.pathname==='/citations'&&Number.isInteger(sender.tab?.id);}catch{return false;}}
function cancel(sender,clientId,scope){cancelledClients.set(sender.tab.id+'|'+clientId,scope);while(cancelledClients.size>200)cancelledClients.delete(cancelledClients.keys().next().value);for(const item of pending.values()){
  const removed=item.consumers.filter(c=>c.tabId===sender.tab.id&&c.clientId===clientId&&(scope==='all'||c.mode==='browse'));
  item.consumers=item.consumers.filter(c=>!removed.includes(c));for(const c of removed){try{c.respond(failure('cancelled'));}catch{}}
  if(!item.consumers.length){item.cancelled=true;if(scope==='all')item.controller?.abort();}
}}
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(!['CCF_RESOLVE_VENUE','CCF_CANCEL_LOOKUPS','CCF_READ_CACHE'].includes(message?.type))return false;
  if(!allowedSender(sender)){respond(failure('invalid_request'));return false;}
  if(message.type==='CCF_READ_CACHE'){if(!Array.isArray(message.papers)||message.papers.length>1000){respond(failure('invalid_request'));return false;}(async()=>{await ready;const items=[];message.papers.forEach((p,index)=>{if(!p||typeof p.title!=='string'||p.title.length>2000||!/^\d{4}$/.test(String(p.year))||typeof p.firstAuthor!=='string'||p.firstAuthor.length>200||p.venue!==undefined&&(typeof p.venue!=='string'||p.venue.length>4000))return;const key=paperKey(p),result=cachedValue(key,p);if(result)items.push({index,result});});respond({ok:true,items});})().catch(()=>respond(failure('network')));return true;}
  const clientId=typeof message.clientId==='string'&&message.clientId.length<=100?message.clientId:'';
  if(message.type==='CCF_CANCEL_LOOKUPS'){if(!clientId){respond(failure('invalid_request'));return false;}cancel(sender,clientId,message.scope==='browse'?'browse':'all');respond({ok:true});return false;}
  const p=message.paper,valid=p&&typeof p.title==='string'&&p.title.trim().length>=4&&p.title.length<=2000&&/^\d{4}$/.test(String(p.year))&&typeof p.firstAuthor==='string'&&p.firstAuthor.trim().length>0&&p.firstAuthor.length<=200&&(!p.venue||typeof p.venue==='string'&&p.venue.length<=4000);
  if(!valid||message.provider&&message.provider!=='dblp'){respond(failure('invalid_request'));return false;}
  (async()=>{await ready;const key=paperKey(p),cached=cachedValue(key,p);if(cached){respond(cached);return;}
    const consumer={respond,tabId:sender.tab.id,clientId,mode:message.mode==='statistics'?'statistics':'browse'};const cancelled=cancelledClients.get(sender.tab.id+'|'+clientId);if(cancelled==='all'||cancelled==='browse'&&consumer.mode==='browse'){respond(failure('cancelled'));return;}
    let item=pending.get(key);if(item?.cancelled&&!item.consumers.length){pending.delete(key);item=null;}
    if(!item){item={key,paper:p,consumers:[]};pending.set(key,item);queue.push(item);}item.consumers.push(consumer);pump();
  })().catch(()=>respond(failure('network')));return true;
});
