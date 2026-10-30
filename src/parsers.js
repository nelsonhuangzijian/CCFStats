(() => {
  const txt=(el,sel)=>el.querySelector(sel)?.textContent.trim()||'';
  function venueText(el){
    const text=el?.textContent.trim()||'',full=el?.getAttribute('title')||'';
    const prefix=text.split(/…|\.{3}/)[0].trim().toLowerCase();
    return /…|\.{3}/.test(text)&&full&&!/…|\.{3}/.test(full)&&full.toLowerCase().startsWith(prefix)?full:text;
  }
  function profileNames(doc=document){
    const result=[],add=text=>{for(const name of String(text||'').split(/[,，;；\n]/)){const clean=name.trim();if(clean)result.push(clean);}};
    const primary=txt(doc,'#gsc_prf_in');if(primary)result.push(primary);
    add(txt(doc,'#gs_prf_ion_txt'));
    for(const el of doc.querySelectorAll('.gsc_prf_il')){const m=el.textContent.trim().match(/^(?:also published as|also known as|alternative names|other names|别名|曾用名|其他姓名)(?:\s*[:：]\s*|\s+)(.+)$/i);if(m)add(m[1]);}
    return [...new Set(result)];
  }
  function doiOf(doc){
    const meta=doc.querySelector('meta[name="citation_doi"],meta[name="dc.identifier" i]')?.content||'';
    const links=[...doc.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
    for(const value of [meta,...links]){
      const match=String(value||'').match(/(?:https?:\/\/(?:dx\.)?doi\.org\/|^doi:\s*|^)(10\.\d{4,9}\/[^\s<>"?#]+)/i);
      if(match)return match[1].replace(/[.,;]+$/,'').toLowerCase();
    }
    return '';
  }
  function scholar(doc=document) {
    return [...doc.querySelectorAll('.gsc_a_tr')].map((el,i)=>{
      const a=el.querySelector('.gsc_a_at'), gr=el.querySelectorAll('.gsc_a_at + .gs_gray, .gsc_a_t > .gs_gray');
      const authors=gr[0]?.textContent.trim()||'',venue=venueText(gr[1]);
      const url=a?new URL(a.getAttribute('href'),location.href).href:'';
      return {element:el,id:url?new URL(url).searchParams.get('citation_for_view')||url:'row-'+i,title:a?.textContent.trim()||'',authors,firstAuthor:authors.split(/[,，]/)[0].trim(),venue,year:txt(el,'.gsc_a_y'),url,doi:doiOf(el),source:'scholar',kind:''};
    }).filter(p=>p.title);
  }
  globalThis.CCF_PARSERS={doiOf,profileNames,scholar};
})();
