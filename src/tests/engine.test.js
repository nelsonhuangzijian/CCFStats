// Run with Node: node tests/run-tests.mjs
// Can also be loaded after catalog.js + engine.js in a browser.
(() => {
  const E=CCF_ENGINE;let passed=0;
  function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){throw Error(name+': '+e.message);}}
  const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify(a)+' != '+JSON.stringify(b));};
  test('681 catalogue entries with valid ranks',()=>{eq(CCF_CATALOG.venues.length,681);eq(CCF_CATALOG.venues.every(v=>['A','B','C'].includes(v.rank)),true);});
  test('CVPR A exact acronym',()=>eq(E.matchVenue('CVPR').venue.rank,'A'));
  test('IJCAI B in 2026',()=>eq(E.matchVenue('IJCAI').venue.rank,'B'));
  test('TMM A in 2026',()=>eq(E.matchVenue('TMM').venue.rank,'A'));
  test('year and pages suffix',()=>eq(E.matchVenue('CVPR 2025, 123-129').venue.rank,'A'));
  test('volume and issue suffix',()=>eq(E.matchVenue('IEEE Transactions on Pattern Analysis and Machine Intelligence 45 (2), 1-10').venue.rank,'A'));
  test('workshop excluded',()=>eq(E.matchVenue('CVPR Workshops'),null));
  test('comma workshop excluded',()=>eq(E.matchVenue('CVPR, Workshops'),null));
  test('conference URL cannot promote a workshop',()=>eq(E.matchVenue('Unknown Workshop','conference','https://dblp.org/db/conf/cvpr/cvpr2025w.html'),null));
  test('truncated venue never promoted',()=>eq(E.matchVenue('CVPR…'),null));
  test('workshop after year never promoted',()=>eq(E.matchVenue('CVPR 2025, Workshops'),null));
  test('arxiv excluded',()=>eq(E.matchVenue('arXiv preprint arXiv:1234.5678'),null));
  test('substring not accepted',()=>eq(E.matchVenue('CVPRX'),null));
  test('journal DBLP URL fallback',()=>eq(E.matchVenue('IEEE Trans. Pattern Anal. Mach. Intell.','journal','https://dblp.org/db/journals/pami/pami47.html').venue.rank,'A'));
  test('kind mismatch is unresolved',()=>eq(E.matchVenue('CVPR','journal'),null));
  test('PID resolves first author',()=>eq(E.authorStatus({firstPid:'08/1510',firstAuthor:'X'},['Y'],'08/1510').status,'yes'));
  test('PID resolves other author',()=>eq(E.authorStatus({firstPid:'08/1511',firstAuthor:'Y'},['Y'],'08/1510').status,'no'));
  test('Scholar initials auto recognized',()=>eq(E.authorStatus({source:'scholar',firstAuthor:'S Zhang'},['San Zhang']).status,'yes'));
  test('explicit initials alias accepted',()=>eq(E.authorStatus({source:'scholar',firstAuthor:'S Zhang'},['San Zhang','S Zhang']).status,'yes'));
  test('truncation unresolved',()=>eq(E.authorStatus({firstAuthor:'San Z…'},['San Zhang']).status,'unknown'));
  test('DBLP disambiguation suffix preserved',()=>eq(E.authorStatus({source:'dblp',firstAuthor:'San Zhang 0001'},['San Zhang 0001']).status,'yes'));
  test('DBLP namesakes never merged',()=>eq(E.authorStatus({source:'dblp',firstAuthor:'San Zhang 0002'},['San Zhang 0001']).status,'unknown'));
  test('DBLP missing disambiguation unresolved',()=>eq(E.authorStatus({source:'dblp',firstAuthor:'San Zhang 0001'},['San Zhang']).status,'unknown'));
  test('dedup by source ID',()=>eq(E.dedup([{id:'a'},{id:'a'},{id:'b'}]).length,2));
  test('same title conference and journal kept',()=>eq(E.dedup([{title:'T',year:'2025',venue:'CVPR'},{title:'T',year:'2025',venue:'TPAMI'}]).length,2));
  test('obsolete manual author override ignored',()=>eq(E.classify({firstAuthor:'Other',source:'dblp',venue:'CVPR'},['Self'],'',{author:'yes'}).author,'no'));
  test('pending and nonfirst excluded from counts',()=>eq(E.summary([{author:'yes',matched:{rank:'A'}},{author:'yes',matched:{rank:'B'}},{author:'yes',matched:null},{author:'unknown',matched:{rank:'C'}},{author:'no',matched:{rank:'A'}}]),{A:1,B:1,C:0,pending:2,nonfirst:1,total:5}));
  test('CSV BOM, quotes and formula protection',()=>{const c=E.csv([{title:'=SUM(1,2)',authors:'A "B"',author:'unknown'}]);eq(c.startsWith('\uFEFF'),true);eq(c.includes("\"'=SUM(1,2)\""),true);eq(c.includes('A ""B""'),true);});
  globalThis.CCF_TEST_RESULTS={passed};console.log(`${passed} engine tests passed`);
})();
