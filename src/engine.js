(() => {
  const norm = s => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
  // Preserve DBLP disambiguation digits to avoid merging namesakes.
  const person = s => norm(s);
  // Normalize bibliographic wrappers without doing fuzzy substring matching.
  function venueKey(raw) {
    return norm(String(raw||'').normalize('NFKC')
      // Main ACL long/short-paper volumes are bibliographic wrappers, not tracks.
      .replace(/\(\s*volume\s+\d+\s*:\s*(?:long|short)\s+papers\s*\)/gi,' ')
      // Strip explicit volume notation before the generic trailing-number rule.
      .replace(/\s+\b(?:v\.?|vol\.?|volume)\s*\d+\s*(?=[,;]|(?:19|20|21)\d{2}\b|$)/gi,' ')
      .replace(/[,;]\s*(?:pp?\.?\s*)?\d[\d\s–—-]*(?:[,;].*)?$/i,'')
      .replace(/\s+\d+\s*(?:\([^)]*\))?\s*(?:[,;:].*)?$/,'')
      .replace(/^(?:19|20|21)\d{2}\s+/, '')
      .replace(/^(?:proceedings|proc\.?)\s+(?:of\s+)?(?:the\s+)?/i,'')
      .replace(/\b(?:19|20|21)\d{2}\b/g,' ')
      .replace(/\b\d+(?:st|nd|rd|th)\b/gi,' ')
      .replace(/\(\s*[a-z][a-z0-9&/\s.-]{1,30}\s*\)/gi,' ')
      .replace(/\s+['’]\d{2}\s*$/,''))
      .replace(/\b(?:ieee|acm|cvf|rsj|ifip|iet)\b/g,' ')
      .replace(/\s+/g,' ').trim();
  }
  const aliases = new Map(), normalizedAliases = new Map();
  function index(map,k,v){if(!k)return;const list=map.get(k)||[];if(!list.includes(v))list.push(v);map.set(k,list);}
  function add(s,v) {index(aliases,norm(s),v);index(normalizedAliases,venueKey(s),v);}
  const secondary = /\b(?:workshops?|companion|posters?|demos?|supplements?|findings|tutorials?|doctoral|arxiv|corr)\b|\b(?:industry|industrial)\s+track\b/i;
  const extra = {
    'NeurIPS':['NIPS','NeurIPS','Advances in Neural Information Processing Systems'],
    'NIPS':['NeurIPS','Advances in Neural Information Processing Systems'],
    'TPAMI':['IEEE Trans. Pattern Anal. Mach. Intell.'],
    'TIP':['IEEE Trans. Image Process.'], 'TKDE':['IEEE Trans. Knowl. Data Eng.'],
    'TNNLS':['IEEE Trans. Neural Networks Learn. Syst.'], 'TMM':['IEEE Trans. Multim.'],
    'TSE':['IEEE Trans. Software Eng.'], 'TOG':['ACM Trans. Graph.'],
    'VLDB':['PVLDB','Proc. VLDB Endow.','Proceedings of the VLDB Endowment'],
    'CIKM':['ACM International on Conference on Information and Knowledge Management','International on Conference on Information and Knowledge Management'],
    'ECML-PKDD':['Joint European Conference on Machine Learning and Knowledge Discovery in Databases','European Conference on Machine Learning and Knowledge Discovery in Databases','Machine Learning and Knowledge Discovery in Databases','ECML/PKDD'],
    'SIGKDD':['KDD','ACM SIGKDD International Conference on Knowledge Discovery and Data Mining','International Conference on Knowledge Discovery and Data Mining'],
    'SIGMOD':['ACM SIGMOD International Conference on Management of Data','International Conference on Management of Data'],
    'SIGSPATIAL':['ACM Special Interest Group on Spatial Information','ACM International Conference on Advances in Geographic Information Systems','ACM International Symposium on Advances in Geographic Information Systems'],
    'SIG-METRICS':['SIGMETRICS'], 'INTER-SPEECH':['INTERSPEECH'],
    'WWW':['The Web Conference','ACM Web Conference','Web Conference','International World Wide Web Conference'],
    'TON':['IEEE/ACM Transactions on Networking','IEEE Trans. Netw.'],
    'ACM SIGOPS ATC（原 USENIX ATC）':['USENIX ATC','USENIX Annual Technical Conference','ACM SIGOPS ATC']
  };
  for(const v of CCF_CATALOG.venues) {
    add(v.abbr,v); add(v.name,v);
    add(v.abbr.split(/[（(]/)[0],v); add(v.name.split(/[（(]/)[0],v);
    // WWW is also a journal abbreviation; conference aliases must stay separate.
    for(const s of extra[v.abbr]||[])if(v.abbr!=='WWW'||v.kind==='conference')add(s,v);
  }
  function mixedProceedings(raw){
    const m=String(raw||'').normalize('NFKC').match(/^\s*(?:proceedings\s+of\s+(?:the\s+)?)?AAAI\s+conference\s+on\s+artificial\s+intelligence\s+(\d+)\s*\(\s*(\d+)\s*\)(?:\s*,\s*(\d+)(?:\s*[-–—]\s*(\d+))?)?/i);
    if(!m)return null;
    const issue=(CCF_CATALOG.mixedIssues||[]).find(i=>i.abbr==='AAAI'&&i.volume===Number(m[1])&&i.issue===Number(m[2]));
    if(!issue)return null;
    const section=issue.sections.find(s=>Number(m[3])===s.firstPage&&(!m[4]||Number(m[4])===s.lastPage));
    return {issue,section};
  }
  // Only discard recognisable bibliographic suffixes after a complete venue name.
  // A short acronym or an unfinished name is never sufficient for this rule.
  function matchBibliographic(raw,kind){
    if(kind&&kind!=='conference'||secondary.test(raw))return null;
    const parts=String(raw).normalize('NFKC').split(/…|\.{3}/);
    if(parts.length>2||parts.length===2&&!/^\s*\)?\s*(?:[,;]\s*(?:19|20|21)\d{2})?\s*$/.test(parts[1]))return null;
    let visible=parts[0].trim();
    const lead=visible.match(/^([a-z][a-z0-9-]*)\s+((?:19|20|21)\d{2})\s*:\s*/i);
    if(lead)visible=visible.slice(lead[0].length);
    const cuts=[visible.length,...[...visible.matchAll(/\s+(?=\d|\()|[,;]/g)].map(m=>m.index)];
    for(const cut of cuts){
      const head=visible.slice(0,cut).trim(),tail=visible.slice(cut).trim();
      if(norm(head).split(' ').length<4)continue;
      const subject=head.split(/\b(?:conference|symposium|meeting|congress)\b/i).slice(1).join(' ');
      if(!subject||/[\d()]/.test(subject))continue;
      const bracket=tail.match(/^\(\s*([a-z][a-z0-9&/-]*)(?:\s+(?:19|20|21)\d{2})?\s*\)?\s*$/i);
      const numeric=tail.replace(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b\.?/gi,'');
      if(tail&&!bracket&&!/^[\d\s(),.;:/–—-]+$/.test(numeric))continue;
      const result=matchVenue(head,'conference');if(!result)continue;
      if([lead?.[1],bracket?.[1]].filter(Boolean).some(abbr=>!(aliases.get(norm(abbr))||[]).includes(result.venue)))continue;
      return {venue:result.venue,basis:'Local catalogue: complete conference name with bibliographic volume, date or acronym suffix'};
    }
    return null;
  }
  // Scholar commonly clips EMNLP immediately before the last word, Processing.
  // Limit confirmation to this distinctive name; shorter/generic prefixes stay candidates.
  function matchTruncatedEmnlp(raw,kind){
    if(kind&&kind!=='conference'||secondary.test(raw))return null;
    const parts=String(raw).normalize('NFKC').split(/…|\.{3}/);
    if(parts.length!==2||!/^\s*(?:[,;]\s*(?:19|20|21)\d{2})?\s*$/.test(parts[1]))return null;
    const prefix=venueKey(parts[0]);
    if(prefix!=='conference on empirical methods in natural language')return null;
    const venues=CCF_CATALOG.venues.filter(v=>v.kind==='conference'&&venueKey(v.name).startsWith(prefix+' '));
    return venues.length===1&&venues[0].abbr==='EMNLP'?{venue:venues[0],basis:'Local catalogue: distinctive main-conference name prefix (EMNLP)'}:null;
  }
  function matchEdition(raw,kind,publicationYear){
    if(kind&&kind!=='conference'||secondary.test(raw))return null;
    const text=String(raw).normalize('NFKC'),parts=text.split(/…|\.{3}/);
    if(parts.length!==2||!/^\s*(?:[,;]\s*(?:19|20|21)\d{2})?\s*$/.test(parts[1]))return null;
    const head=parts[0],ordinals=[...head.matchAll(/\b(\d+)(?:st|nd|rd|th)\b/gi)],years=[...text.matchAll(/\b((?:19|20|21)\d{2})\b/g)].map(m=>Number(m[1]));
    if(ordinals.length!==1)return null;
    if(publicationYear!==undefined&&publicationYear!==''){
      if(!/^(?:19|20|21)\d{2}$/.test(String(publicationYear)))return null;
      years.push(Number(publicationYear));
    }
    const uniqueYears=[...new Set(years)];if(uniqueYears.length!==1)return null;
    const prefix=venueKey(head.replace(/\b(?:ieee\s*(?:[/&]|and)?\s*acm|acm\s*(?:[/&]|and)?\s*ieee)\b/gi,' '));
    if(prefix.length<32||prefix.split(' ').length<4)return null;
    const found=(CCF_CATALOG.editions||[]).filter(item=>item.year===uniqueYears[0]&&item.edition===Number(ordinals[0][1])&&item.publishers.every(p=>new RegExp('\\b'+p+'\\b','i').test(head))).map(item=>CCF_CATALOG.venues.find(v=>v.abbr===item.abbr&&v.kind==='conference')).filter(v=>v&&(venueKey(v.name)===prefix||venueKey(v.name).startsWith(prefix+' ')));
    const venues=[...new Set(found)];
    return venues.length===1?{venue:venues[0],basis:'Local catalogue: conference name, publisher, year and verified edition match'}:null;
  }
  function matchVenue(raw, kind='', venueUrl='', publicationYear) {
    const original=String(raw||'');
    if(mixedProceedings(original))return null;
    if(/…|\.{3}/.test(original))return matchBibliographic(original,kind)||matchTruncatedEmnlp(original,kind)||matchEdition(original,kind,publicationYear);
    if(/^\s*[a-z][a-z0-9-]*\s+(?:19|20|21)\d{2}\s*:/i.test(original)){
      const bibliographic=matchBibliographic(original,kind);if(bibliographic)return bibliographic;
      return null; // A conflicting leading acronym must not disappear in normalisation.
    }
    // In Scholar venue text, WWW + a year denotes the annual Web Conference.
    // Bare WWW remains ambiguous, and an explicit journal kind retains its meaning.
    if(kind!=='journal'&&/^\s*WWW\s+(?:19|20|21)\d{2}\s*$/i.test(original)){
      const venue=(aliases.get('www')||[]).find(v=>v.kind==='conference');
      if(venue)return {venue,basis:'Local catalogue: WWW annual conference abbreviation and year'};
    }
    // PACM containers publish several conferences. Require an explicit, compatible issue name.
    const container=original.match(/^\s*proceedings\s+of\s+(?:the\s+)?acm\s+on\s+(software engineering|management of data)\s+(.+)$/i);
    if(container){
      if(secondary.test(original))return null;
      const issue=norm(container[2]).match(/^(?:\d+\s+)*(issta|sigmod)(?:\s+\d+)*$/i)?.[1]?.toUpperCase();
      const expected=/^software/i.test(container[1])?'ISSTA':'SIGMOD';
      if(issue!==expected)return null;
      const venue=(aliases.get(norm(issue))||[]).find(v=>v.kind==='conference');
      return venue?{venue,basis:'ACM 论文集容器与明确会议期号匹配（'+issue+'）'}:null;
    }
    const byKind=list=>(list||[]).filter(v=>!kind||v.kind===kind);
    const exact=byKind(aliases.get(norm(original)));
    if(exact.length===1)return {venue:exact[0],basis:'目录全称 / 简称 / 别名精确匹配'};
    // A secondary track cannot inherit a main conference's rank via its acronym.
    if(secondary.test(original))return null;
    const cleaned=original.replace(/\s*\(\d+\)\s*$/,'').trim();
    const keys=[norm(cleaned),norm(cleaned.replace(/\s+\d+\s*(?:\([^)]*\))?\s*(?:[,;:].*)?$/,''))];
    let found=byKind([...new Set(keys.flatMap(k=>aliases.get(k)||[]))]);
    let basis='目录简称 / 别名匹配';
    if(!found.length){found=byKind(normalizedAliases.get(venueKey(cleaned)));basis='移除年份、届次、出版社、卷号与页码后，刊物名称精确匹配';}
    // Parenthesized acronyms must agree with the full name, rather than override it.
    const brackets=[...original.matchAll(/\(([^()]+)\)/g)].map(m=>byKind(aliases.get(norm(m[1])))).filter(list=>list.length);
    if(found.length&&brackets.some(list=>!found.some(v=>list.includes(v))))return null;
    // Conference folders also contain workshops; only journal URLs are a safe fallback.
    if(!found.length && kind==='journal' && venueUrl) {
      const path=String(venueUrl).match(/\/db\/journals\/([^/]+)/)?.[1];
      if(path)found=CCF_CATALOG.venues.filter(v=>v.kind==='journal'&&v.url.match(/\/db\/journals\/([^/]+)/)?.[1]===path);
      basis='DBLP 期刊链接匹配';
    }
    return found.length===1?{venue:found[0],basis}:null;
  }
  function venueCandidate(raw,kind='') {
    const original=String(raw||'');
    if(!/…|\.{3}/.test(original)||secondary.test(original))return null;
    const prefix=venueKey(original.split(/…|\.{3}/)[0].replace(/\(\s*[a-z][a-z0-9&/\s.-]*$/i,''));
    const words=prefix.split(' ');
    if(prefix.length<32||words.length<6)return null;
    const specific=words.filter(w=>!['international','conference','proceedings','symposium','annual','on','of','the','and','for','in'].includes(w));
    if(specific.length<1)return null;
    const candidates=[...new Set([...normalizedAliases].filter(([key])=>(key===prefix||key.startsWith(prefix+' '))).flatMap(([,values])=>values))].filter(v=>!kind||v.kind===kind);
    return candidates.length===1?{venue:candidates[0],basis:'截断名称前缀对应 '+candidates[0].abbr+'，需补全详情确认'}:null;
  }
  // Independent implementation of name normalization + whole-list best matching.
  // See tests/AUTHOR_MATCHING.md for the inspected Author Highlighter reference.
  const nameParts=s=>person(String(s||'').replace(/['’]/g,'')).split(' ').filter(Boolean);
  function editDistance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next;}return row[b.length];}
  function authorScore(author,name){
    if(/…|\.{3}/.test(author))return Infinity;
    const parts=nameParts(author),fullParts=nameParts(name),candidate=parts.join(''),full=fullParts.join('');
    if(!candidate||!full)return Infinity;
    if(candidate===full)return -2;
    const counts=new Map();for(const ch of full)counts.set(ch,(counts.get(ch)||0)+1);
    for(const ch of candidate){if(!counts.get(ch))return Infinity;counts.set(ch,counts.get(ch)-1);}
    const family=parts.at(-1);
    if(family.length<=1||!fullParts.includes(family))return Infinity;
    let score=editDistance(candidate,full);
    if(candidate[0]===full[0])score-=0.5;
    const following=full.indexOf(family)+family.length;
    if(candidate.length>family.length&&following<full.length&&candidate[0]===full[following])score-=1;
    return score;
  }
  function bestAuthor(authors,names){
    const scored=authors.map((author,index)=>({index,score:Math.min(...names.map(name=>authorScore(author,name)))})).filter(x=>Number.isFinite(x.score));
    if(!scored.length)return {index:-1,ambiguous:false};
    const min=Math.min(...scored.map(x=>x.score)),best=scored.filter(x=>x.score===min);
    return {index:best.length===1?best[0].index:-1,ambiguous:best.length>1};
  }
  function authorStatus(p,names,pid='') {
    if(p.firstPid && pid)return {status:p.firstPid===pid?'yes':'no',basis:'DBLP 第一作者 PID'};
    if(!p.firstAuthor)return {status:'unknown',basis:'未获取到第一作者'};
    if(/…|\.{3}/.test(p.firstAuthor))return {status:'unknown',basis:'第一作者姓名被截断'};
    const n=person(p.firstAuthor),ns=names.map(person).filter(Boolean);
    if(!ns.length)return {status:'unknown',basis:'未读取到主页姓名'};
    if(p.source==='scholar'){
      const authors=String(p.authors||p.firstAuthor).split(/[,，]/).map(s=>s.trim()).filter(s=>s&&!/^(?:\.{3,}|…)$/.test(s));
      const best=bestAuthor(authors,names);
      if(best.ambiguous)return {status:'unknown',basis:'多个作者同分，身份无法唯一对应'};
      if(best.index>=0)return {status:best.index===0?'yes':'no',basis:'主页姓名 / 别名规范化与缩写匹配，最佳匹配位于第 '+(best.index+1)+' 位'};
      return {status:'no',basis:'第一作者与主页姓名 / 别名不匹配'};
    }
    if(ns.includes(n))return {status:'yes',basis:'DBLP 完整作者姓名精确匹配'};
    if(ns.some(s=>s.replace(/ \d{4}$/,'')===n.replace(/ \d{4}$/,'')))return {status:'unknown',basis:'DBLP 同名编号未精确对应'};
    return {status:'no',basis:'DBLP 完整第一作者姓名不匹配'};
  }
  function venueStatus(p,override={}) {
    const mixed=mixedProceedings(p.venue);
    if(mixed){
      const section=mixed.section&&(!p.year||String(p.year)===String(mixed.issue.year))&&!secondary.test(String(p.venue))?mixed.section:null;
      return {matched:null,nonCcf:!!section,venueMethod:'catalog',candidate:null,nonCcfVenue:section?.name||'',venueAbbreviation:section?.abbr||'',venueBasis:section?'Local catalogue: publisher-verified proceedings section and page range':'Mixed proceedings issue; main-conference rank is not inferred',note:override.note||''};
    }
    const m=matchVenue(p.venue,p.kind,p.venueUrl,p.year),candidate=m?null:venueCandidate(p.venue,p.kind);
    const resolved=p.lookupVenueId&&CCF_CATALOG.venues.find(v=>v.id===p.lookupVenueId);
    const manual=override.venueId&&CCF_CATALOG.venues.find(v=>v.id===override.venueId);
    const localNonCcf=secondary.test(String(p.venue||''))&&!/…|\.{3}/.test(p.venue);
    const matched=m?.venue||resolved||manual||null,nonCcf=!matched&&(p.nonCcf===true||localNonCcf);
    const pageMapping=p.source==='dblp'||/^DBLP 页面/.test(p.lookupBasis||'');
    const venueMethod=!m&&!pageMapping&&(resolved||nonCcf&&!localNonCcf&&(p.lookupRecord||/^DBLP/.test(p.lookupBasis||'')))?'dblp':'catalog';
    return {matched,nonCcf,venueMethod,candidate:matched||nonCcf?null:candidate?.venue||null,venueBasis:matched?(m?.basis||(resolved?p.lookupBasis||'DBLP 论文元数据自动核对':'已指定目录条目')):nonCcf?(p.lookupBasis||'已识别为非 CCF A/B/C 刊物'):candidate?.basis||'未匹配，待补全',note:override.note||''};
  }
  function classify(p,names,pid,override={}) {
    const a=authorStatus(p,names,pid);
    return {...p,author:a.status,authorBasis:a.basis,...venueStatus(p,override)};
  }
  function dedup(rows) {
    const seen=new Set();return rows.filter(p=>{const k=p.id||[norm(p.title),p.year,norm(p.venue)].join('|');if(seen.has(k))return false;seen.add(k);return true;});
  }
  function summary(rows) {
    const s={A:0,B:0,C:0,pending:0,nonfirst:0,total:rows.length};
    for(const p of rows) {if(p.author==='no')s.nonfirst++;else if(p.author==='yes'&&p.matched)s[p.matched.rank]++;else if(!p.nonCcf)s.pending++;}return s;
  }
  function csv(rows,meta={}) {
    const tr=meta.translate||((s)=>s);
    const all=[['目录版本','作者主页','统计范围','题名','年份','第一作者','作者原文','刊物原文','一作状态','CCF','目录刊物','一作依据','分类依据','备注','链接'].map(tr),...rows.map(p=>[CCF_CATALOG.version,meta.profile||'',meta.scope||'',p.title,p.year,p.firstAuthor,p.authors,p.venue,tr(({yes:'一作',no:'非一作',unknown:'待确认'})[p.author]),p.matched?.rank||(p.nonCcf?'N':''),p.matched?.name||'',tr(p.authorBasis),tr(p.venueBasis),p.note,p.url])];
    return '\uFEFF'+all.map(row=>row.map(v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"').join(',')).join('\r\n');
  }
  globalThis.CCF_ENGINE={norm,person,isSecondaryVenue:raw=>secondary.test(String(raw||'')),venueKey,matchVenue,venueCandidate,venueStatus,authorScore,bestAuthor,authorStatus,classify,dedup,summary,csv};
})();
