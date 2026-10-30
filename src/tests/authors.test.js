(() => {
  const E=CCF_ENGINE;let passed=0;
  const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify(a)+' != '+JSON.stringify(b));};
  const status=(authors,names)=>E.authorStatus({firstAuthor:authors.split(',')[0].trim(),authors,source:'scholar'},names).status;
  function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){throw Error(name+': '+e.message);}}
  test('Automatic first initial and family name',()=>eq(status('S Zhang, Alan Li',['San Zhang']),'yes'));
  test('Dotted initial and author marker',()=>eq(status('S. Zhang*, Alan Li',['San Zhang']),'yes'));
  test('Multiple given-name initials',()=>eq(status('JM Smith, Alan Li',['John Michael Smith']),'yes'));
  test('Hyphenated given name initials',()=>eq(status('JP Sartre, Alan Li',['Jean-Paul Sartre']),'yes'));
  test('Accents normalized',()=>eq(status('J Garcia, Alan Li',['José García']),'yes'));
  test('Apostrophes normalized',()=>eq(status("S OConnor, Alan Li",["Sean O’Connor"]),'yes'));
  test('Surname-first profile ordering',()=>eq(status('J Wang, Alan Li',['Wang Jingdong']),'yes'));
  test('Exact owner in second position beats abbreviated first',()=>eq(status('S Zhang, San Zhang, Alan Li',['San Zhang']),'no'));
  test('Owner in second position is not first',()=>eq(status('Alan Li, S Zhang',['San Zhang']),'no'));
  test('Profile alias matches automatically',()=>eq(status('H Li, Alan Li',['San Zhang','Huayang Li']),'yes'));
  test('Wrong surname rejected',()=>eq(status('S Wang, Alan Li',['San Zhang']),'no'));
  test('Surname substring rejected',()=>eq(status('S Li, Alan Li',['San Lin']),'no'));
  test('Wrong initial with no character match rejected',()=>eq(status('X Zhang, Alan Li',['San Zhang']),'no'));
  test('Incomplete single initial rejected',()=>eq(status('S, Alan Li',['San Zhang']),'no'));
  test('Equal author matches remain ambiguous',()=>eq(status('S Zhang, S Zhang',['San Zhang']),'unknown'));
  test('Truncated tail does not hide visible first author',()=>eq(status('S Zhang, Alan Li, …',['San Zhang']),'yes'));
  test('Partially truncated first name remains unknown',()=>eq(status('San Z…, Alan Li',['San Zhang']),'unknown'));
  test('Chinese exact alias matches',()=>eq(status('张三, 李四',['San Zhang','张三']),'yes'));
  test('DBLP PID remains authoritative over names',()=>eq(E.authorStatus({source:'dblp',firstAuthor:'San Zhang',firstPid:'other'},['San Zhang'],'self').status,'no'));
  test('Old manual author override cannot suppress automatic acceptance',()=>{const p=E.classify({source:'scholar',firstAuthor:'S Zhang',authors:'S Zhang, Alan Li',venue:'ICDE'},['San Zhang'],'',{author:'unknown'});eq(p.author,'yes');eq(E.summary([p]).A,1);});
  test('Automatic venue match takes priority over legacy manual selection',()=>{const old=CCF_CATALOG.venues.find(v=>v.abbr==='ICDM');const p=E.classify({source:'scholar',firstAuthor:'S Zhang',authors:'S Zhang, Alan Li',venue:'ICDE'},['San Zhang'],'',{venueId:old.id});eq(p.matched.abbr,'ICDE');eq(p.matched.rank,'A');});
  globalThis.CCF_AUTHOR_RESULTS={passed};console.log(`${passed} author matching tests passed`);
})();
