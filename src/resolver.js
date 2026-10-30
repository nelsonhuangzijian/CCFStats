(() => {
  const E=CCF_ENGINE,plain=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');
  const titleKey=s=>E.norm(plain(s));
  // A truncated Scholar venue is evidence for checking results, not a rank.
  function venueHints(paper){
    const text=String(paper?.venue||'');
    if(E.isSecondaryVenue(text))return [];
    const exact=E.matchVenue(text,paper?.kind||'','',paper?.year);if(exact)return [exact.venue];
    if(!/…|\.{3}/.test(text))return [];
    const prefix=E.venueKey(text.split(/…|\.{3}/)[0]);
    if(prefix.length<32||prefix.split(' ').length<4||! /\bconference\b/.test(prefix))return [];
    return CCF_CATALOG.venues.filter(v=>v.kind==='conference'&&(!paper?.kind||paper.kind===v.kind)&&[v.name,v.abbr].some(name=>{const key=E.venueKey(name);return key===prefix||key.startsWith(prefix+' ');}));
  }
  function recordCompatible(info,paper){
    const hints=venueHints(paper);if(!hints.length)return true;
    if(!info||titleKey(info.title)!==titleKey(paper.title)||Math.abs(Number(info.year)-Number(paper.year))>1||!Number.isFinite(Number(info.year)))return false;
    const venue=venueFromInfo(info);
    return !!venue&&hints.some(v=>v.id===venue.id);
  }
  function venueFromInfo(info){
    let url;try{url=new URL(info.url);}catch{return null;}
    if(!['dblp.org','dblp.uni-trier.de','dblp.dagstuhl.de'].includes(url.hostname)||!['http:','https:'].includes(url.protocol))return null;
    const parts=url.pathname.match(/^\/rec\/(conf|journals)\/([^/]+)\//);if(!parts)return null;
    const folder='/db/'+parts[1]+'/'+parts[2]+'/',venues=(Array.isArray(info.venue)?info.venue:[info.venue]).filter(Boolean).map(plain);
    if(info.type==='Informal Publications'||venues.some(E.isSecondaryVenue)||/\b(?:workshop|companion|poster|demo)\b|\d{4}w(?:[/-]|$)/i.test(url.pathname))return null;
    const issue=String(info.number||'').toUpperCase(),special={pacmpl:['POPL','PLDI','OOPSLA','ICFP'],pacmse:['ISSTA'],pacmmod:['SIGMOD']}[parts[2]];
    if(special){const found=special.filter(abbr=>new RegExp('\\b'+abbr+'[12]?\\b').test(issue));return found.length===1?E.matchVenue(found[0])?.venue||null:null;}
    const linked=CCF_CATALOG.venues.filter(v=>[...(v.urls||[]),v.url].some(link=>{try{return new URL(link).pathname.replace(/index\.html$/,'')===folder;}catch{return false;}}));
    if(linked.length===1)return linked[0];
    // CCFrank falls back to issue/venue abbreviations when the record folder is absent.
    for(const text of [issue,...venues]){const match=E.matchVenue(text);if(match)return match.venue;}
    return null;
  }
  function selectRecord(payload,paper){
    const result=payload?.result?.hits;if(!result||typeof result!=='object')throw Error('DBLP 返回的结果格式无效');
    const hits=Array.isArray(result.hit)?result.hit:result.hit?[result.hit]:[];if(!hits.length)return null;
    const hints=venueHints(paper);
    let selected;
    if(hints.length){
      const candidates=hits.filter(h=>h.info&&recordCompatible(h.info,paper));
      const priority=h=>Number(h.info.year)===Number(paper.year)?0:Number(h.info.year)===Number(paper.year)+1?1:2;
      candidates.sort((a,b)=>priority(a)-priority(b));
      const best=candidates.filter(h=>priority(h)===priority(candidates[0]||{info:{}}));
      // Equally plausible main venues must not be decided by API result order.
      if(new Set(best.map(h=>venueFromInfo(h.info)?.id)).size===1)selected=best[0];
    }
    else if(Number(result['@total']??hits.length)===1)selected=hits[0];
    else selected=hits.filter(h=>h.info&&h.info.type!=='Informal Publications'&&Math.abs(Number(h.info.year)-Number(paper.year))<=1).sort((a,b)=>{
      const priority=y=>Number(y)===Number(paper.year)?0:Number(y)===Number(paper.year)+1?1:2;return priority(a.info.year)-priority(b.info.year);
    })[0];
    if(!selected?.info)return null;
    const record={};for(const key of ['title','year','venue','type','url','number','volume']){const value=selected.info[key];if(typeof value==='string'||typeof value==='number')record[key]=String(value).slice(0,2000);else if(key==='venue'&&Array.isArray(value))record[key]=value.filter(v=>typeof v==='string').slice(0,8).map(v=>v.slice(0,1000));}return record;
  }
  function classifyRecord(info){
    if(!info)return {state:'unmatched',match:null};
    const venue=venueFromInfo(info);
    if(venue)return {state:'ranked',match:{venueId:venue.id,abbr:venue.abbr,rank:venue.rank,recordUrl:info.url,basis:'DBLP 论文搜索与刊物映射（CCFrank 方式）：'+venue.abbr},record:info};
    let url;try{url=new URL(info.url);}catch{return {state:'unmatched',match:null};}
    const folder=url.pathname.match(/^\/rec\/(conf|journals)\/([^/]+)\//),venues=(Array.isArray(info.venue)?info.venue:[info.venue]).filter(v=>typeof v==='string'&&v.trim());
    const valid=['dblp.org','dblp.uni-trier.de','dblp.dagstuhl.de'].includes(url.hostname)&&['https:','http:'].includes(url.protocol)&&folder&&info.title&&venues.length&&venues.every(v=>!/[.…]{3}|…/.test(v));
    // Missing PACM issue information is unresolved, never evidence of a non-CCF venue.
    if(!valid||['pacmpl','pacmse','pacmmod'].includes(folder[2]))return {state:'unmatched',match:null,record:info};
    return {state:'non_ccf',match:null,record:info};
  }
  function resolveDblp(payload,paper){return classifyRecord(selectRecord(payload,paper)).match;}
  globalThis.CCF_RESOLVER={titleKey,resolveDblp,venueFromInfo,selectRecord,classifyRecord,venueHints,recordCompatible};
})();
