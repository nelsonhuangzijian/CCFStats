(async () => {
  const previous=globalThis.CCF_WIDGET;
  previous?.reposition?.();
  if(previous?.host?.isConnected){previous.show();return;}
  const E=CCF_ENGINE,P=CCF_PARSERS,I=CCF_I18N;await I.ready;
  const isScholar=/^scholar\.google\./.test(location.hostname)||!!document.querySelector('#gsc_prf_in');
  if(isScholar&&!document.querySelector('#gsc_prf_in'))return;
  if(!isScholar)return; // Public build supports Scholar profiles only.
  const pid='';
  const profile=isScholar?new URL(location.href).searchParams.get('user')||'demo':pid||'demo';
  const storageKey=`ccf-v1:${isScholar?'scholar':'dblp'}:${profile}`;
  const name=(isScholar?document.querySelector('#gsc_prf_in'):document.querySelector('h1'))?.textContent.trim()||'';
  const host=document.createElement('section');host.id='ccf-first-author-panel';host.dataset.ccfOwned='widget';
  const sh=host.attachShadow({mode:'open'});
  sh.innerHTML=`<style>
    :host{all:initial;display:block;color:#263445;font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid #4d90fe;outline-offset:3px}button:disabled{opacity:.5;cursor:wait}.box{background:white;border:1px solid #dce2ea;border-radius:10px;box-shadow:0 3px 14px #172b4d0e;overflow:hidden}.head{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:8px 10px;border-bottom:1px solid #ebedf1}.head h2{font-size:13px;font-weight:650;line-height:1.4;margin:0}.small{color:#768292;font-size:11px}.head small{display:block;margin-top:1px;font-size:10px;color:#8390a1}.icon{border:0;background:transparent;color:#7b8794;font-size:17px;border-radius:4px;min-width:24px;height:25px}.body{padding:8px 10px 9px}.scope{margin-bottom:8px;font-size:11px;color:#718096}.ranks{display:grid;gap:4px}.rank-head{display:grid;grid-template-columns:72px minmax(0,1fr) minmax(0,1fr);gap:6px;padding:0 8px 3px;color:#8793a2;font-size:10px;text-align:right}.rank-head span:first-child{text-align:left}.rank{display:grid;grid-template-columns:14px 52px minmax(0,1fr) minmax(0,1fr);align-items:center;gap:6px;border:1px solid #e8ecf2;border-radius:6px;padding:4px 8px;cursor:pointer;background:#fff}.rank:has(input:checked){background:#f8faff}.rank input{accent-color:#3478db;width:14px;height:14px;margin:0;cursor:pointer}.pill{border:1px solid currentColor;background:transparent;font-size:11px;font-weight:700;padding:1px 7px;border-radius:4px;line-height:19px}.A{color:#b62834}.B{color:#235db0}.C{color:#1f7548}.metric{text-align:right;min-width:0}.metric small{display:none;color:#8a95a2;font-size:10px;font-weight:400;line-height:1.3}.count{display:block;font-size:14px;line-height:1.25;font-weight:650;color:#344459;font-variant-numeric:tabular-nums}.unit{font-size:11px;color:#8a95a2;margin-left:2px}.selected{display:flex;justify-content:space-between;gap:6px;margin-top:5px;font-size:10px;color:#6d7b8d}.selected strong{color:#2e68b2;font-weight:600}.actions{display:flex;align-items:center;gap:8px;margin-top:5px}.display-filters{display:flex;gap:8px;justify-content:space-between;margin-top:7px}.display-filters label{display:flex;align-items:center;gap:4px;font-size:10px;white-space:nowrap;cursor:pointer}.display-filters input{width:12px;height:12px;margin:0;accent-color:#3478db}#completeSummary{font-size:10px;color:#607e70;white-space:nowrap}.btn{border:1px solid #d9e1ec;background:white;color:#4c6585;border-radius:5px;font-size:11px;padding:5px 9px;flex:1}#scan:disabled{cursor:not-allowed}.btn:hover{background:#f4f7fb}.btn.primary{background:#f0f5ff;border-color:#d5e3fd;color:#3265ac}.status:empty{display:none}.status{font-size:10px;color:#7d8998;line-height:1.4;margin-top:5px;overflow-wrap:anywhere}.error{color:#b74134}.progress{font-size:10px;padding:5px 6px;border-radius:5px;background:#f4f7fb;color:#4c6585}.progress.partial{background:#fff8e8;color:#8a681a}.settings{border-top:1px solid #edf0f4;margin-top:10px;padding-top:7px}.settings summary{font-size:11px;color:#788596;cursor:pointer}.settings label{display:block;font-size:11px;margin-top:9px;color:#617085}.settings input[type=text]{width:100%;border:1px solid #d6dfeb;padding:5px 7px;border-radius:4px;margin-top:5px;font-size:11px;min-width:0}.settings input[type=checkbox]{accent-color:#3478db;vertical-align:middle;margin:0 5px 0 0}.hint{font-size:10px;color:#8a95a2;margin-top:5px;line-height:1.6}.year-group{margin:0 0 6px;padding-bottom:6px;border-bottom:1px solid #edf0f4}.year{display:flex;align-items:center;gap:5px;font-size:11px;color:#617085}.year label{font-weight:600;margin-right:2px}.year select{flex:1;width:0;min-width:0;height:26px;border:1px solid #d6dfeb;background:#fff;color:#344459;padding:2px 3px;border-radius:4px;font-size:11px}.year select[aria-invalid="true"]{border-color:#b74134}.year-meta{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-top:4px}.year-meta .hint{margin:0}.year-meta button{border:0;padding:0;background:transparent;font-size:10px;color:#6681a0}.year-meta button:disabled{color:#acb6c2;cursor:default}.foot{font-size:9px;color:#98a1ad;background:#fbfcfe;border-top:1px solid #edf0f4;padding:4px 10px}.collapsed .body,.collapsed .foot{display:none}[hidden]{display:none!important}
  </style><div class="box" id="box"><header class="head"><div><h2>CCF Statistics</h2><small id="countScope" hidden>Total &amp; first-author papers</small></div><button id="collapse" class="icon" aria-label="折叠 CCF 统计" aria-expanded="true">−</button></header><div class="body" id="body"><div class="scope" hidden>Load papers, select ranks, then start statistics.</div><div class="year-group" id="yearRange"><div class="year"><label for="from">Year<span aria-hidden="true">*</span>:</label><select id="from" required aria-required="true" aria-label="Start year" aria-describedby="yearScope"><option value="">Start</option></select><span aria-hidden="true">–</span><select id="to" required aria-required="true" aria-label="End year" aria-describedby="yearScope"><option value="">End</option></select></div><div class="year-meta"><div id="yearScope" class="hint">All years</div><button id="clearYears" type="button" aria-label="Clear year range">Reset</button></div></div><div class="rank-head" aria-hidden="true"><span>Rank</span><span>Total</span><span title="First-author papers">First</span></div><div class="ranks">
  <label class="rank"><input id="rankA" type="checkbox" checked aria-label="统计 CCF A 论文"><span class="pill A">CCF A</span><span class="metric"><small>Total</small><span class="count" id="countA">—</span></span><span class="metric"><small title="First-author papers">First</small><span class="count" id="firstCountA">—</span></span></label>
  <label class="rank"><input id="rankB" type="checkbox" checked aria-label="统计 CCF B 论文"><span class="pill B">CCF B</span><span class="metric"><small>Total</small><span class="count" id="countB">—</span></span><span class="metric"><small title="First-author papers">First</small><span class="count" id="firstCountB">—</span></span></label>
  <label class="rank"><input id="rankC" type="checkbox" checked aria-label="统计 CCF C 论文"><span class="pill C">CCF C</span><span class="metric"><small>Total</small><span class="count" id="countC">—</span></span><span class="metric"><small title="First-author papers">First</small><span class="count" id="firstCountC">—</span></span></label></div>
  <div id="displayFilters" class="display-filters" role="group" aria-label="Display filters" hidden><label title="Show only publications in selected ranks"><input id="showOnlyHighlighted" type="checkbox" aria-label="Show selected ranks only">Selected ranks</label><label title="Show first-author publications in selected ranks"><input id="countFirstOnly" type="checkbox" aria-label="Show first-author only">First author</label></div>
  <div class="selected"><span><strong id="selected">0</strong> shown</span><span id="pending">0 篇刊物待匹配</span></div><div class="actions"><button id="scan" class="btn primary">开始统计</button><button id="review" class="btn" hidden disabled>核对详情</button><span id="completeSummary" role="status" hidden></span></div><div id="lookupProgress" class="hint progress" role="status" hidden></div><div id="lookupBreakdown" class="hint" hidden></div><button id="retryFailed" class="btn" style="margin-top:7px;width:100%" hidden>重试失败项</button><button id="pauseLookup" class="btn" style="margin-top:7px;width:100%" hidden>暂停补全</button><div class="status" id="status" role="status" aria-live="polite"></div>
  <details class="settings" hidden><summary>设置与统计口径</summary><label><input id="autoLookup" type="checkbox" checked>自动匹配未识别刊物</label><div class="hint">打开页面先展示本地和缓存标签，仅联网补全屏幕附近论文。点击统计后补全剩余已加载论文，可暂停。成功识别缓存 90 天，无结果缓存 1 天。</div><label for="names">本人姓名 / 其他别名（分号分隔）</label><input id="names" type="text" placeholder="例如 San Zhang; S Zhang"><div class="hint">自动比较完整作者列表中的姓名与缩写，并读取主页别名。可补充其他姓名写法。</div><div class="hint">只统计勾选的等级，未勾选等级不统计。同时展示总数与一作数；完成后可按所选等级或一作筛选展示。年份范围仍生效。CCF 2026 第七版统一评级。</div></details></div><footer class="foot" id="foot">CCF 2026 · 当前已加载 0 篇</footer></div>`;
  const $=id=>sh.getElementById(id);I.localize(sh);host.lang='en';
  const filterStyle=document.createElement('style');filterStyle.dataset.ccfOwned='filter-style';filterStyle.textContent=`[data-ccf-filter-hidden="1"]{display:none!important}
    [data-ccf-highlight-rank="A"]{--ccf-outline:#b62834}
    [data-ccf-highlight-rank="B"]{--ccf-outline:#235db0}
    [data-ccf-highlight-rank="C"]{--ccf-outline:#1f7548}
    [data-ccf-highlighted="1"]>.gsc_a_t{position:relative;padding-left:18px!important}
    .entry[data-ccf-highlighted="1"]{position:relative;padding-left:18px!important}
    [data-ccf-highlighted="1"]>.gsc_a_t::before,.entry[data-ccf-highlighted="1"]::before{content:"";position:absolute;left:0;top:14px;width:7px;height:46px;background:var(--ccf-outline);clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);pointer-events:none}
    .entry[data-ccf-highlighted="1"]::before{top:2px;height:calc(100% - 4px);max-height:46px}`;document.documentElement.append(filterStyle);
  const placement=CCF_PLACEMENT.mount(host,$('body'),isScholar,()=>{scheduleLookup(labelRows);if(started)render();else updateControls();});
  let started=false,displayReady=false,dirty=false,applied=null,classifiedRows=[],statistics={A:null,B:null,C:null},firstStatistics={A:null,B:null,C:null},lookupEpoch=0;
  let labelRows=[],raw=[],overrides={},detailCache=new Map(),badges=new Map(),saveTimer=null,scanTimer=null,observer=null,collapsed=false;
  const sources=new Map(),metadataCache=new Map();const metadataKey='ccf-metadata-dblp-v4:'+storageKey;let metadataTimer=null; 
  const lookupTried=new Set();let lookupQueue=[],lookupRunning=false,lookupBlocked=false,lookupNote='',fullRun=false,userPaused=false,statsFinished=false;
  const lookupFailures=new Map();let retryTimer=null,autoWaitUntil=0,waitReason='',recoveryCycles=0;
  let statsIds=new Set(),statsAttempted=new Set(),activePaper=null,viewportTimer=null;
  let yearPending=false,coveredYears=[],coverageSignature='';const coveredPaperKeys=new Set();
  const sessionId=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),clientId=()=>sessionId+'-'+lookupEpoch;
  const lookupKey=p=>[E.norm(p.title),p.year,E.person(p.firstAuthor)].join('|');
  function readRows(){
    const rows=P.scholar();
    for(const p of rows){const old=sources.get(p.id);if(old&&cacheKey(old)!==cacheKey(p)){detailCache.delete(p.id);lookupTried.delete(lookupKey(old));}sources.set(p.id,{...p,element:undefined});}return rows;
  }
  const cacheKey=p=>JSON.stringify([p.source,lookupKey(p),p.venue,p.kind,p.doi||'']);
  function patchFor(result){const record=result.record,positive=!!result.match||result.state==='non_ccf';return {lookupRevision:1,lookupVenueId:result.match?.venueId||'',nonCcf:result.state==='non_ccf',nonCcfVenue:Array.isArray(record?.venue)?record.venue.join(' / '):record?.venue||'',lookupBasis:result.match?.basis||(result.state==='non_ccf'?'DBLP 已识别刊物，未列入当前 CCF A/B/C 目录':''),lookupRecord:record||null,lookupCheckedUntil:result.until||Date.now()+(positive?90:1)*86400000};}
  async function loadMetadata(){try{
    const saved=(await chrome.storage.local.get(metadataKey))[metadataKey];
    for(const [key,entry] of saved?.entries||[])if(entry.until>Date.now()&&entry.data){
      if(entry.data.lookupRecord)entry.data={...entry.data,...patchFor({...CCF_RESOLVER.classifyRecord(entry.data.lookupRecord),until:entry.until})};
      else if(entry.version!==CCF_CATALOG.version)continue;
      metadataCache.set(key,entry);
    }
    const oldKey='ccf-metadata-dblp-v3:'+storageKey,old=(await chrome.storage.local.get(oldKey))[oldKey];
    for(const [key,entry] of old?.entries||[])if(entry.until>Date.now()&&entry.version===CCF_CATALOG.version){const parts=JSON.parse(key);parts.shift();const newKey=JSON.stringify(parts);if(!metadataCache.has(newKey))metadataCache.set(newKey,entry);}
  }catch{}}
  async function primeSharedCache(rows){
    if(!isScholar||typeof chrome.runtime?.sendMessage!=='function')return;
    const unknown=rows.filter(p=>!resolved(E.venueStatus(p,overrides[p.id]))&&!(metadataCache.get(cacheKey(sources.get(p.id)||p))?.until>Date.now()));
    for(let start=0;start<unknown.length;start+=1000){const batch=unknown.slice(start,start+1000);try{const result=await chrome.runtime.sendMessage({type:'CCF_READ_CACHE',papers:batch.map(p=>({title:p.title,year:p.year,firstAuthor:p.firstAuthor,venue:p.venue,kind:p.kind}))});if(result?.ok)for(const item of result.items||[]){const p=batch[item.index];if(p&&item.result?.ok&&cacheKey(sources.get(p.id)||p)===cacheKey(p))cacheMetadata(p,patchFor(item.result));}}catch{}}
  }
  function cacheMetadata(p,patch){
    const source=sources.get(p.id)||p,data={};
    for(const key of ['title','authors','firstAuthor','venue','kind','year','doi','lookupVenueId','lookupBasis','detailLoaded','nonCcf','nonCcfVenue','lookupRecord','lookupCheckedUntil','lookupRevision'])if(patch[key]!==undefined)data[key]=patch[key];
    const venue=E.venueStatus({...source,...data});if(!venue.matched&&!venue.nonCcf&&!data.lookupCheckedUntil)return;
    metadataCache.set(cacheKey(source),{data,until:data.lookupCheckedUntil||Date.now()+90*86400000,version:CCF_CATALOG.version});
    while(metadataCache.size>1000)metadataCache.delete(metadataCache.keys().next().value);
    clearTimeout(metadataTimer);metadataTimer=setTimeout(async()=>{try{await chrome.storage.local.set({[metadataKey]:{entries:[...metadataCache]}});}catch{}},180);
  }
  const current=p=>p.epoch===lookupEpoch&&p.sourceKey===cacheKey(sources.get(p.id)||p)&&host.isConnected&&labelRows.some(row=>row.id===p.id&&E.norm(row.title)===E.norm(p.title)&&row.year===p.year);
  const resolved=p=>!!p.matched||p.nonCcf===true;
  function cancelRequests(scope='all'){clearTimeout(retryTimer);retryTimer=null;const id=clientId();try{if(lookupRunning||lookupQueue.length)chrome.runtime?.sendMessage?.({type:'CCF_CANCEL_LOOKUPS',clientId:id,scope})?.catch?.(()=>{});}catch{}lookupEpoch++;lookupQueue=[];if(activePaper)lookupTried.delete(activePaper.key);}
  function statRows(){return labelRows.filter(p=>statsIds.has(p.id));}
  const canLookup=p=>isScholar&&!!p.firstAuthor&&/^\d{4}$/.test(p.year);
  function partial(){return started&&(userPaused||!statsFinished||statRows().some(p=>!resolved(p)));}
  const transient=code=>['server_error','timeout','network_or_cors','network'].includes(code);
  const checked=p=>resolved(p)||p.lookupCheckedUntil>Date.now()||statsAttempted.has(p.id)||!canLookup(p);
  const failed=p=>lookupFailures.get(lookupKey(p))?.exhausted===true;
  const needsWork=p=>!checked(p)&&!failed(p);
  function progressCounts(){const rows=statRows();return {identified:rows.filter(resolved).length,unmatched:rows.filter(p=>!resolved(p)&&checked(p)).length,failed:rows.filter(failed).length,pending:rows.filter(needsWork).length};}
  function nextRetry(rows){return Math.min(...rows.filter(needsWork).map(p=>lookupFailures.get(lookupKey(p))?.retryAt||Infinity).filter(t=>t>Date.now()));}
  function waitingUntil(){const rows=fullRun?statRows():nearViewport(labelRows.filter(inRange));if(!rows.some(p=>needsWork(p)&&canLookup(p)))return 0;if(autoWaitUntil>Date.now())return autoWaitUntil;if(lookupRunning||lookupQueue.length)return 0;const due=nextRetry(rows);return Number.isFinite(due)?due:0;}
  function waitText(){const until=waitingUntil(),seconds=Math.max(1,Math.ceil((until-Date.now())/1000));return autoWaitUntil>Date.now()?`${waitReason==='rate_limited'?'DBLP 请求受限':'DBLP 暂时不可用'}，${seconds} 秒后自动继续。`:`临时查询失败，${seconds} 秒后自动重试。`;}
  function armRetry(until){
    if(!Number.isFinite(until)||userPaused||lookupBlocked)return;clearTimeout(retryTimer);const epoch=lookupEpoch;
    retryTimer=setTimeout(()=>{retryTimer=null;if(epoch!==lookupEpoch||userPaused||!host.isConnected)return;const rows=fullRun?statRows():nearViewport(labelRows.filter(inRange)),ready=autoWaitUntil<=Date.now()&&rows.some(p=>needsWork(p)&&canLookup(p)&&!lookupTried.has(lookupKey(p))&&!(lookupFailures.get(lookupKey(p))?.retryAt>Date.now()));if(!ready&&waitingUntil()>Date.now()){lookupNote=waitText();updateControls();armRetry(waitingUntil());}else{lookupNote='';scheduleLookup(labelRows);if(started)render();else updateControls();}},Math.min(1000,Math.max(1,until-Date.now())));
  }
  function updateProgress(){
    $('lookupProgress').hidden=!started||statsFinished&&!partial();$('lookupBreakdown').hidden=!started||statsFinished&&!partial();$('lookupProgress').classList.toggle('partial',partial());
    const waiting=statsFinished?0:waitingUntil(),c=started?progressCounts():null;
    $('pauseLookup').hidden=!(fullRun||userPaused||waiting);$('pauseLookup').textContent=I.t(userPaused?'继续补全':'暂停补全');
    $('retryFailed').hidden=!started||!c.failed;$('retryFailed').disabled=fullRun||dirty||yearPending;
    if(started)$('retryFailed').textContent=I.t(`重试失败项（${c.failed}）`);
    if(!started){$('completeSummary').hidden=true;return;}
    const done=statsFinished?statsIds.size:c.identified+c.unmatched+c.failed;
    const state=userPaused?'已暂停 · 部分结果':waiting?'等待自动重试 · 部分结果':!statsFinished?'正在补全 · 部分结果':partial()?'统计完成 · 部分结果':'统计完成';
    $('lookupProgress').textContent=I.t(`已处理 ${done}/${statsIds.size} 篇`)+' · '+I.t(state);
    $('completeSummary').hidden=!statsFinished||partial();$('completeSummary').textContent=`Done ${done}/${statsIds.size}`;$('completeSummary').title=$('lookupProgress').textContent;
    $('lookupBreakdown').textContent=I.t(`已识别 ${c.identified} · 未匹配 ${c.unmatched} · 失败 ${c.failed} · 待处理 ${c.pending}`);
    if(waiting&&!userPaused)lookupNote=waitText();
  }
  function metadataChanged(){refreshLabels();scan();globalThis.CCF_REFRESH_REVIEW?.();}
  const status=(text,error=false)=>{$('status').textContent=String(text).split('\n').map(line=>I.t(line)).join('\n');$('status').classList.toggle('error',error);};
  function chosenNames(){return [...new Set([name,...P.profileNames(),...$('names').value.split(/[;；\n]/)].map(s=>s.trim()).filter(Boolean))];}
  // Year choices come from loaded publications, retaining active selections on refresh.
  const yearSessionKey=storageKey+':years';let yearSessionLoaded=false;
  function populateYears(rows=readRows(),selection=null){
    const values=selection||{from:$('from').value,to:$('to').value};
    const years=[...new Set([...rows.map(p=>p.year),values.from,values.to].filter(y=>/^\d{4}$/.test(String(y))&&+y>=1900&&+y<=2100).map(Number))].sort((a,b)=>b-a);
    for(const id of ['from','to']){
      const select=$(id);select.replaceChildren(new Option(id==='from'?'Start':'End',''));
      for(const year of years)select.add(new Option(String(year),String(year)));
      select.value=values[id]||'';
    }
  }
  function restoreYearSession(){
    if(yearSessionLoaded)return;yearSessionLoaded=true;let selection={};
    try{selection=JSON.parse(sessionStorage.getItem(yearSessionKey)||'{}')||{};}catch{}
    populateYears(readRows(),selection);
  }
  function requestedYears(){return {from:$('from').value,to:$('to').value};}
  const coveragePaperKey=p=>p.id+'|'+cacheKey(sources.get(p.id)||p);
  function yearContains(p,range){const {from:f,to:t}=range;return !f&&!t||/^\d{4}$/.test(p.year)&&(!f||+p.year>=+f)&&(!t||+p.year<=+t);}
  function coversYears(range){
    if(labelRows.some(p=>yearContains(p,range)&&!coveredPaperKeys.has(coveragePaperKey(p))))return false;
    if(!range.from&&!range.to&&!coveredYears.some(r=>!r.from&&!r.to))return false;
    let next=Number(range.from)||1900;const end=Number(range.to)||2100;
    if(next>end)return true;
    for(const r of coveredYears.map(r=>[Number(r.from)||1900,Number(r.to)||2100]).sort((a,b)=>a[0]-b[0])){
      if(r[1]<next)continue;if(r[0]>next)return false;next=Math.max(next,r[1]+1);if(next>end)return true;
    }
    return false;
  }
  function filterYears(){
    const range=requestedYears();
    try{sessionStorage.setItem(yearSessionKey,JSON.stringify(range));}catch{}
    if(started){
      yearPending=!!yearError()||!coversYears(range);
      if(!yearPending)applied.years=range;
      scan();
    }else{applyYearVisibility();updateControls();}
  }
  function applyYearVisibility(rows=readRows(),preserveDisplayFilters=false){
    for(const p of rows)if(p.element){if(!inRange(p))p.element.setAttribute('data-ccf-filter-hidden','1');else if(!preserveDisplayFilters)p.element.removeAttribute('data-ccf-filter-hidden');}
  }
  function yearError(){
    let invalid=false;for(const id of ['from','to']){const input=$(id),bad=input.validity.badInput||!!input.value&&(!/^\d{4}$/.test(input.value)||+input.value<1900||+input.value>2100);input.setAttribute('aria-invalid',String(bad));invalid=invalid||bad;}
    if(invalid)return 'Enter a whole year from 1900 to 2100.';
    if(!$('from').value||!$('to').value)return 'Select Start and End years.';
    if($('from').value&&$('to').value&&+$('from').value>+$('to').value){for(const id of ['from','to'])$(id).setAttribute('aria-invalid','true');return 'Start year must not be later than End year.';}
    return '';
  }
  function yearLabel(range){return range.from&&range.to?range.from===range.to?range.from:`${range.from}–${range.to}`:range.from?`From ${range.from}`:range.to?`Through ${range.to}`:'All years';}
  function inRange(p){return !started&&(!$('from').value||!$('to').value||+$('from').value>+$('to').value)||yearContains(p,started?applied.years:requestedYears());}
  function markDirty(){dirty=true;updateControls();}
  function updateControls(){
    const rangeError=yearError();$('scan').disabled=!!rangeError;
    $('selected').parentElement.parentElement.hidden=!started;$('foot').hidden=true;
    $('clearYears').disabled=!$('from').value&&!$('to').value&&!$('from').validity.badInput&&!$('to').validity.badInput;
    $('yearScope').textContent=yearPending?'Counted: '+yearLabel(applied.years):rangeError||yearLabel(requestedYears());
    $('scan').textContent=I.t(!started?'开始统计':dirty||yearPending?'更新统计':'重新统计');
    updateProgress();if(waitingUntil()&&!userPaused)status(waitText());$('review').disabled=!displayReady||dirty||yearPending;
    $('displayFilters').hidden=!started||!displayReady;
    if(!started){
      $('countScope').textContent='Total & first-author papers';
      for(const rank of ['A','B','C'])for(const prefix of ['count','firstCount'])$(prefix+rank).textContent='—';
      $('selected').textContent='—';$('pending').textContent='';$('foot').textContent=I.t('CCF 2026 · 尚未统计');
      status(lookupNote||'',lookupBlocked);
    }else if(yearPending&&yearError())status(yearError(),true);
    else if(yearPending)status('New years selected. Click “Update statistics”.');
    else if(dirty)status('条件或论文列表已更改，请点击「更新统计」应用。');
    I.localize(sh);sh.host.lang='en';
  }
  function badgeFor(p){
    const title=p.element?.querySelector(isScholar?'.gsc_a_at':'.title');if(!title)return null;
    let badge=badges.get(p.id);
    if(!badge?.isConnected||badge.previousElementSibling!==title){badge?.remove();badge=document.createElement('span');badge.dataset.ccfOwned='badge';badge.className='ccf-inline-badge';badge.attachShadow({mode:'open'});title.after(badge);badges.set(p.id,badge);}
    return badge;
  }
  // Labels and venue completion run independently of manual statistics.
  function refreshLabels(source=readRows()){
    labelRows=E.dedup(hydrateRows(source)).map(p=>({...p,...E.venueStatus(p,overrides[p.id])}));
    populateYears(source);applyYearVisibility(source,started);
    renderLabels(labelRows);scheduleLookup(labelRows);
  }
  function badgeAbbreviation(p){
    if(p.venueAbbreviation)return p.venueAbbreviation;
    if(p.matched?.abbr)return p.matched.abbr.replace(/[（(]原[^）)]*[）)]/g,'').trim()||I.t('未提供缩写');
    const record=p.lookupRecord?.venue;
    if(record)return Array.isArray(record)?record.join(' / '):String(record);
    const text=String(p.nonCcfVenue||p.venue||'').trim();
    const acronym=text.match(/\(([A-Z][A-Z0-9/& .-]{1,30})\)\s*$/)?.[1];
    if(acronym)return acronym;
    if(/^(?:[A-Z][A-Z0-9/&.-]*|CoRR|arXiv)(?:\s+(?:Workshops?|Companion|Findings|Demos?|Tutorials?))?$/.test(text))return text;
    return I.t('未提供缩写');
  }
  function renderLabels(rows){
    labelRows=rows;
    for(const row of rows){const p=row,rank=row.matched?.rank||(row.nonCcf?'N':'');
      if(!rank){badges.get(p.id)?.remove();badges.delete(p.id);continue;}
      const badge=badgeFor(row);if(!badge)continue;
      badge.setAttribute('aria-label',I.t(`CCF ${rank}${row.author==='yes'?'，第一作者':''}`));
      const method=row.venueMethod==='dblp'?'DBLP搜索':'目录';
      badge.title=[I.t(row.matched?row.matched.name.replace(/[（(]原[^）)]*[）)]/g,'').trim():row.nonCcfVenue||row.venue||'非 CCF A/B/C 刊物'),I.t(`CCF ${rank} · 2026 第七版`),I.t(`${method}：${badgeAbbreviation(row)}`)].map(line=>String(line).replace(/\s+/g,' ').trim()).join('\n');
      // Each badge owns its styles so it can coexist with other Scholar extensions.
      if(badge.dataset.rank!==rank){badge.dataset.rank=rank;const color={A:'#b62834',B:'#235db0',C:'#1f7548',N:'#758191'}[rank];badge.shadowRoot.innerHTML=`<style>:host{display:inline-block!important;vertical-align:baseline!important;margin:0 0 0 7px!important;white-space:nowrap!important;line-height:normal!important}span{display:inline-block;font:750 11.5px/22px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;letter-spacing:.35px;width:56px;box-sizing:border-box;text-align:center;padding:0 9px;border:1.5px solid currentColor;border-radius:5px;color:${color};background:transparent;vertical-align:1px}</style><span>CCF ${rank}</span>`;}
    }
    const currentIds=new Set(rows.map(p=>p.id));
    for(const [id,badge] of badges){if(!currentIds.has(id)){badge.remove();badges.delete(id);}}
  }
  function render(){
    if(!started){applyYearVisibility();updateControls();return;}
    const allRows=classifiedRows,rows=allRows.filter(inRange),firstOnly=$('countFirstOnly').checked;
    $('countScope').textContent='Total & first-author papers';
    const visible=new Map(allRows.map(p=>[p.id,p]));
    const selectedRanks=['A','B','C'].filter(r=>applied.ranks[r]);
    const highlighted=p=>inRange(p)&&!!p.matched&&selectedRanks.includes(p.matched.rank);
    // First-author display must also stay within the applied rank selection.
    const shown=p=>inRange(p)&&(!firstOnly||p.author==='yes')&&(!(firstOnly||$('showOnlyHighlighted').checked)||highlighted(p));
    for(const rank of ['A','B','C']){
      $('count'+rank).textContent=statistics[rank]===null?'—':statistics[rank];
      $('firstCount'+rank).textContent=firstStatistics[rank]===null?'—':firstStatistics[rank];
      $('firstCount'+rank).setAttribute('aria-label',I.t(firstStatistics[rank]===null?'未选择此等级，未统计':`CCF ${rank} 一作 ${firstStatistics[rank]} 篇`));
      if(statistics[rank]===null)$('count'+rank).setAttribute('aria-label',I.t('未选择此等级，未统计'));
      else $('count'+rank).removeAttribute('aria-label');
    }
    $('selected').textContent=allRows.filter(shown).length;
    const unmatched=progressCounts().unmatched;$('pending').textContent=unmatched?`${unmatched} unmatched`:'';
    $('foot').textContent=`CCF 2026 · 当前已加载 ${raw.length} 篇`;sh.querySelector('h2').title=`CCF 2026 · ${raw.length} loaded publications`;
    for(const p of raw){
      const row=visible.get(p.id),rank=row?.matched?.rank;
      if(p.element){if(row&&highlighted(row)){p.element.setAttribute('data-ccf-highlighted','1');p.element.setAttribute('data-ccf-highlight-rank',rank);}else{p.element.removeAttribute('data-ccf-highlighted');p.element.removeAttribute('data-ccf-highlight-rank');}if(row&&shown(row))p.element.removeAttribute('data-ccf-filter-hidden');else p.element.setAttribute('data-ccf-filter-hidden','1');}
    }
    status(lookupNote||'',lookupBlocked);
    updateControls();
  }
  function hydrateRows(rows){return rows.map(p=>{
    const source=sources.get(p.id)||p,cached=metadataCache.get(cacheKey(source));
    let saved=cached?.until>Date.now()?cached.data:{},detail=detailCache.get(p.id);
    if(isScholar&&CCF_RESOLVER.venueHints(source).length){
      const stale=data=>data&&(data.lookupRecord?!CCF_RESOLVER.recordCompatible(data.lookupRecord,source):(data.lookupCheckedUntil||data.lookupVenueId||data.nonCcf)&&data.lookupRevision!==1);
      if(stale(saved)){metadataCache.delete(cacheKey(source));saved={};lookupTried.delete(lookupKey(source));}
      if(stale(detail)){detailCache.delete(p.id);detail=undefined;lookupTried.delete(lookupKey(source));}
    }
    return {...p,...(!isScholar?{lookupVenueId:source.lookupVenueId,lookupBasis:source.lookupBasis,nonCcf:source.nonCcf}:{}),...saved,...detail,element:p.element};
  });}
  function nearViewport(rows){
    const height=window.innerHeight||document.documentElement.clientHeight,visible=[];let next=-1;
    rows.forEach((p,i)=>{const rect=p.element?.getBoundingClientRect();if(!rect||rect.height<=0)return;if(rect.bottom>0&&rect.top<height)visible.push(i);else if(next<0&&rect.top>=height&&rect.top<height*2)next=i;});
    if(!visible.length)return next<0?[]:rows.slice(next,next+20);
    return rows.slice(visible[0],Math.min(rows.length,visible.at(-1)+21));
  }
  function scheduleLookup(rows){
    if(!host.isConnected){lookupQueue=[];return;}
    if(!isScholar||userPaused||lookupBlocked||(!fullRun&&(!$('autoLookup').checked||document.hidden))){lookupQueue=[];settle();return;}
    const target=fullRun?rows.filter(p=>statsIds.has(p.id)):nearViewport(rows.filter(inRange));
    if(!target.some(p=>needsWork(p)&&canLookup(p))){lookupQueue=[];clearTimeout(retryTimer);retryTimer=null;settle();return;}
    if(autoWaitUntil>Date.now()){lookupQueue=[];lookupNote=waitText();armRetry(autoWaitUntil);settle();return;}
    autoWaitUntil=0;
    lookupQueue=target.filter(needsWork).filter(p=>canLookup(p)&&!lookupTried.has(lookupKey(p))&&!(lookupFailures.get(lookupKey(p))?.retryAt>Date.now())).map(p=>({...p,key:lookupKey(p),sourceKey:cacheKey(sources.get(p.id)||p),epoch:lookupEpoch,mode:fullRun?'statistics':'browse'}));
    processLookups();const due=nextRetry(target);if(Number.isFinite(due))armRetry(due);settle();
  }
  function resetDisplayFilters(){const changed=$('countFirstOnly').checked||$('showOnlyHighlighted').checked;$('countFirstOnly').checked=false;$('showOnlyHighlighted').checked=false;return changed;}
  function settle(){
    // Completion depends on current in-scope work, including delayed retries.
    if(fullRun&&!statRows().some(needsWork)){fullRun=false;statsFinished=true;displayReady=true;if(resetDisplayFilters()){render();scheduleSave();}}
    if(started&&!fullRun&&!lookupRunning)displayReady=true;
    updateControls();
  }
  function lookupFailure(result){
    const messages={missing_host_permission:'DBLP 访问权限未授予；请在扩展管理页允许 DBLP 访问后重试。',permission_check_failed:'无法检查 DBLP 权限；请重新加载扩展并刷新作者页。',network_or_cors:'DBLP 连接失败（网络或跨域拦截）；请检查网络与扩展访问权限后重试。',
      rate_limited:'DBLP 请求过于频繁（HTTP 429）；请稍后重新统计，已识别结果保留。',
      forbidden:'DBLP 拒绝访问（HTTP 403）；请检查网站访问状态后重试，已识别结果保留。',
      timeout:'DBLP 查询超时；请检查网络后重新统计，已识别结果保留。',
      invalid_response:'DBLP 返回的内容无法解析，可能是访问验证页；请稍后重新统计。',
      network:'DBLP 网络请求失败；请检查网络后重新统计，已识别结果保留。',
      extension:'扩展查询连接中断；请刷新作者页后重新统计。',
      server_error:'DBLP 服务暂时异常；请稍后重新统计，已识别结果保留。'
    };
    return messages[result?.code]||'DBLP 查询失败；请稍后重新统计，已识别结果保留。';
  }
  async function processLookups(){
    if(lookupRunning||!lookupQueue.length)return;lookupRunning=true;
    try{while(lookupQueue.length&&!userPaused&&host.isConnected){
      if(autoWaitUntil>Date.now()||lookupBlocked)break;
      if(!fullRun&&(document.hidden||!$('autoLookup').checked))break;
      const p=lookupQueue.shift(),latest=labelRows.find(row=>row.id===p.id);if(!current(p)||!latest||!needsWork(latest)||lookupFailures.get(p.key)?.retryAt>Date.now())continue;activePaper=p;lookupTried.add(p.key);
      lookupNote='正在通过 DBLP 查询论文刊物…';if(started)render();else updateControls();
      let result;try{result=await chrome.runtime.sendMessage({type:'CCF_RESOLVE_VENUE',provider:'dblp',clientId:clientId(),mode:p.mode,paper:{title:p.title,year:p.year,firstAuthor:p.firstAuthor,venue:p.venue,kind:p.kind}})||{ok:false,code:'extension'};}catch{result={ok:false,code:'extension'};}
      if(!current(p)){lookupTried.delete(p.key);continue;}
      activePaper=null;
      if(!result.ok){
        lookupTried.delete(p.key);if(result.code==='cancelled')continue;
        const globalWait=result.globalWait||['rate_limited','service_cooldown'].includes(result.code);
        if(globalWait){
          autoWaitUntil=Math.max(Date.now()+1000,Number(result.retryAt)||Date.now()+Math.max(1,Number(result.retryAfter)||60)*1000);waitReason=result.code==='rate_limited'?'rate_limited':'service_cooldown';recoveryCycles++;
          if(recoveryCycles>3){lookupBlocked=true;lookupNote='DBLP 多次恢复失败，已暂停；可稍后点击继续补全。';if(fullRun){fullRun=false;userPaused=true;statsFinished=false;displayReady=true;}lookupQueue=[];break;}
        }
        if(transient(result.code)){
          const attempts=(lookupFailures.get(p.key)?.attempts||0)+1,exhausted=attempts>3;
          lookupFailures.set(p.key,{attempts,code:result.code,exhausted,retryAt:exhausted?0:Math.max(autoWaitUntil,Date.now()+[5000,15000,45000][attempts-1]*(.8+Math.random()*.4))});
          if(autoWaitUntil>Date.now()){lookupQueue=[];break;}continue;
        }
        if(globalWait){lookupQueue=[];break;}
        lookupBlocked=true;lookupNote=lookupFailure(result);lookupQueue=[];if(fullRun){fullRun=false;userPaused=true;statsFinished=false;displayReady=true;}break;
      }
      lookupFailures.delete(p.key);recoveryCycles=0;
      statsAttempted.add(p.id);
      const patch=patchFor(result);detailCache.set(p.id,{...p,...detailCache.get(p.id),...patch});cacheMetadata(p,patch);metadataChanged();
    }}finally{activePaper=null;lookupRunning=false;if(!lookupBlocked&&!waitingUntil())lookupNote='';scheduleLookup(labelRows);settle();if(started)render();else updateControls();}
  }
  function scan(){
    if(!started)return;
    raw=E.dedup(hydrateRows(raw));
    classifiedRows=raw.map(p=>E.classify(p,applied.names,pid,overrides[p.id]));
    statistics=Object.fromEntries(['A','B','C'].map(r=>[r,applied.ranks[r]?0:null]));
    firstStatistics=Object.fromEntries(['A','B','C'].map(r=>[r,applied.ranks[r]?0:null]));
    for(const p of classifiedRows)if(inRange(p)&&p.matched&&applied.ranks[p.matched.rank]){statistics[p.matched.rank]++;if(p.author==='yes')firstStatistics[p.matched.rank]++;}
    const known=new Map(classifiedRows.map(p=>[p.id,p]));renderLabels(labelRows.map(p=>{const cached=known.get(p.id);return cached?{...p,author:cached.author,authorBasis:cached.authorBasis}:p;}));render();
  }
  function start(){
    if(!['A','B','C'].some(r=>$('rank'+r).checked)){status('请至少选择一个 CCF 等级后再开始统计。',true);return;}
    const rangeError=yearError();if(rangeError){status(rangeError,true);return;}
    clearTimeout(scanTimer);observer?.takeRecords();resetDisplayFilters();
    const years=requestedYears(),signature=JSON.stringify([chosenNames(),['A','B','C'].map(r=>$('rank'+r).checked),overrides]);
    if(signature!==coverageSignature){coveredYears=[];coveredPaperKeys.clear();statsAttempted.clear();coverageSignature=signature;}
    coveredYears.push({...years});yearPending=false;
    cancelRequests();lookupBlocked=false;lookupNote='';lookupTried.clear();lookupFailures.clear();autoWaitUntil=0;recoveryCycles=0;userPaused=false;statsFinished=false;
    applied={...snapshot(),years,rawNames:$('names').value,names:chosenNames()};started=true;displayReady=false;dirty=false;
    raw=E.dedup(hydrateRows(readRows()));statsIds=new Set(raw.filter(inRange).map(p=>p.id));for(const p of raw.filter(inRange))coveredPaperKeys.add(coveragePaperKey(p));fullRun=true;refreshLabels(raw);scan();scheduleSave();
  }
  function snapshot(){return {names:$('names').value,overrides,ranks:Object.fromEntries(['A','B','C'].map(r=>[r,$('rank'+r).checked])),firstOnlyFilter:$('countFirstOnly').checked,showOnlyHighlighted:$('showOnlyHighlighted').checked,displayFilterVersion:1,filterVersion:3,autoLookup:$('autoLookup').checked,collapsed};}
  async function persist(){try{await chrome.storage.local.set({[storageKey]:snapshot()});}catch(e){status('设置保存失败：'+e.message,true);}}
  function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(persist,180);}
  function apply(stored){restoreYearSession();$('countFirstOnly').checked=started&&stored.displayFilterVersion===1&&stored.firstOnlyFilter===true;$('showOnlyHighlighted').checked=started&&stored.displayFilterVersion===1&&stored.showOnlyHighlighted===true;overrides=stored.overrides||{};$('names').value=stored.names??name;$('autoLookup').checked=stored.autoLookup!==false;for(const r of ['A','B','C'])$('rank'+r).checked=stored.filterVersion===3?stored.ranks?.[r]!==false:stored.filterVersion===2?stored.showOnlySelected===false?false:stored.ranks?.[r]!==false:true;collapsed=!!stored.collapsed;setCollapsed(collapsed);}
  async function reloadSettings(rows=[]){mergeRows(rows,false);try{const data=(await chrome.storage.local.get(storageKey))[storageKey]||{};apply(data);}catch(e){status(e.message,true);}if(started){if(applied.rawNames!==$('names').value||['A','B','C'].some(r=>applied.ranks[r]!==$('rank'+r).checked))dirty=true;scan();}else updateControls();refreshLabels();}
  function mergeRows(rows,redraw=true){for(const p of rows)if(p.detailLoaded||!p.element)detailCache.set(p.id,p);if(redraw){for(const p of rows)if(p.detailLoaded)cacheMetadata(p,p);refreshLabels();scan();}}
  function setCollapsed(value){collapsed=value;$('box').classList.toggle('collapsed',value);$('collapse').textContent=value?'+':'−';$('collapse').setAttribute('aria-label',I.t(value?'展开 CCF 统计':'折叠 CCF 统计'));$('collapse').setAttribute('aria-expanded',String(!value));}
  $('collapse').onclick=()=>{setCollapsed(!collapsed);scheduleSave();};
  for(const r of ['A','B','C'])$('rank'+r).onchange=()=>{markDirty();scheduleSave();};
  for(const id of ['countFirstOnly','showOnlyHighlighted'])$(id).onchange=()=>{render();scheduleSave();};
  $('names').oninput=()=>{markDirty();scheduleSave();};
  for(const id of ['from','to'])$(id).onchange=filterYears;
  $('clearYears').onclick=()=>{$('from').value='';$('to').value='';filterYears();};
  $('autoLookup').onchange=()=>{if(!fullRun){cancelRequests();lookupBlocked=false;lookupNote='';if($('autoLookup').checked)refreshLabels();}updateControls();scheduleSave();};
  $('pauseLookup').onclick=()=>{if(userPaused){if(dirty||yearPending){status('条件或论文列表已更改，请点击「更新统计」应用。');return;}userPaused=false;fullRun=started;statsFinished=false;lookupBlocked=false;lookupNote='';recoveryCycles=0;displayReady=false;refreshLabels();}else{userPaused=true;fullRun=false;statsFinished=false;cancelRequests();lookupNote='';displayReady=started;render();}};
  $('retryFailed').onclick=()=>{if(fullRun||dirty||yearPending)return;cancelRequests();for(const p of statRows())if(failed(p)){lookupFailures.delete(lookupKey(p));lookupTried.delete(lookupKey(p));}userPaused=false;fullRun=true;statsFinished=false;lookupBlocked=false;lookupNote='';recoveryCycles=0;displayReady=false;refreshLabels();scan();};
  $('scan').onclick=start;
  globalThis.CCF_WIDGET={host,reposition:placement.refresh,start,scan:()=>{if(!started)return;raw=E.dedup(hydrateRows(readRows()));refreshLabels(raw);scan();},hydrateRows,mergeRows,reloadSettings,get countedRanks(){return started?['A','B','C'].filter(r=>applied.ranks[r]):[];},get isPartial(){return partial();},get started(){return started;},get dirty(){return dirty||yearPending;},show:()=>{setCollapsed(false);updateControls();host.scrollIntoView({block:'nearest'});}};
  const onViewport=()=>{clearTimeout(viewportTimer);viewportTimer=setTimeout(()=>{if(host.isConnected)scheduleLookup(labelRows);},120);};
  chrome.runtime?.onMessage?.addListener((message,sender,respond)=>{if(message?.type!=='CCF_SHOW_PANEL')return false;globalThis.CCF_WIDGET.show();respond({ok:true});return false;});
  window.addEventListener('scroll',onViewport,{passive:true});window.addEventListener('resize',onViewport);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!fullRun){cancelRequests('browse');}else if(!document.hidden)scheduleLookup(labelRows);});
  I.subscribe(()=>{setCollapsed(collapsed);renderLabels(labelRows);render();});
  await loadMetadata();await primeSharedCache(readRows());await reloadSettings();
  const owned=node=>node.nodeType===1&&node.hasAttribute('data-ccf-owned')||node.parentElement?.closest('[data-ccf-owned]');
  observer=new MutationObserver(records=>{
    const publicationSelector='.gsc_a_tr,.entry.article,.entry.inproceedings';
    const changed=records.some(record=>{
      if(owned(record.target))return false;
      const nodes=[...record.addedNodes,...record.removedNodes];if(nodes.length&&nodes.every(owned))return false;
      const target=record.target.nodeType===1?record.target:record.target.parentElement;
      if(target?.closest(publicationSelector+',#gsc_a_b'))return true;
      return [...record.addedNodes,...record.removedNodes].some(n=>n.nodeType===1&&!owned(n)&&(n.matches(publicationSelector)||n.querySelector(publicationSelector)));
    });
    if(!changed)return;
    clearTimeout(scanTimer);scanTimer=setTimeout(async()=>{if(host.isConnected){const rows=readRows();await primeSharedCache(rows);refreshLabels(rows);if(started)markDirty();}else observer.disconnect();},180);
  });
  observer.observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:true});
})();
