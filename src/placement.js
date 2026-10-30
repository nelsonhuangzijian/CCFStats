(() => {
  if(globalThis.CCF_PLACEMENT)return;
  function mount(host,body,isScholar,onRestore=()=>{}){
    let timer=null,observer=null,everMounted=false;
    const visible=el=>!!el?.getClientRects().length&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';
    const selectors='#gsc_rsb,#gsc_rsb_cit,#gsc_rsb_st';
    function refresh(){
      const wasConnected=host.isConnected;
      let parent,anchor=null,mode;
      if(isScholar){
        const sidebar=document.querySelector('#gsc_rsb'),citation=document.querySelector('#gsc_rsb_cit'),table=document.querySelector('#gsc_rsb_st');
        if(visible(citation)){parent=citation.parentElement;anchor=citation;mode='scholar-citations';}
        else if(visible(table)){
          const section=table.closest('.gsc_rsb_s');anchor=section&&section!==sidebar?section:table;parent=anchor.parentElement;mode='scholar-citations';
        }else if(visible(sidebar)){
          parent=sidebar;anchor=[...sidebar.children].find(el=>el!==host)||null;mode='scholar-sidebar';
        }else{
          // Keep an inline control when Scholar hides its citation sidebar on small screens.
          anchor=document.querySelector('.gsc_a_tr')?.closest('table')||document.querySelector('#gsc_a_t');
          parent=anchor?.parentElement||document.body||document.documentElement;mode='scholar-inline';
        }
        const style='display:block!important;position:relative!important;width:100%!important;min-width:0!important;max-width:'+(mode==='scholar-inline'?'360px':'none')+'!important;margin:0 0 16px!important;box-sizing:border-box!important;';
        if(host.style.cssText!==style){host.style.cssText=style;}
        if(body.style.cssText)body.style.cssText='';
      }else{
        parent=document.documentElement;mode='dblp-floating';
        host.style.cssText='display:block!important;position:fixed!important;right:18px!important;bottom:18px!important;width:278px!important;max-width:calc(100vw - 24px)!important;z-index:2147483645!important;';
        body.style.cssText='max-height:calc(100vh - 120px);overflow:auto;';
      }
      host.dataset.ccfPlacement=mode;
      if(host.parentElement!==parent||(anchor&&host.nextElementSibling!==anchor))parent.insertBefore(host,anchor);
      const restored=everMounted&&!wasConnected&&host.isConnected;everMounted=true;if(restored)onRestore();
    }
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(refresh,40);};
    refresh();
    if(isScholar){
      observer=new MutationObserver(records=>{
        const sidebar=document.querySelector('#gsc_rsb'),citation=document.querySelector('#gsc_rsb_cit');
        const relevant=!host.isConnected||records.some(record=>{
          const target=record.target.nodeType===1?record.target:record.target.parentElement;
          if(target?.closest('[data-ccf-owned]'))return false;
          if(record.type==='attributes')return target===sidebar||target===citation||target?.contains(sidebar)||target?.contains(citation);
          const nodes=[...record.addedNodes,...record.removedNodes];
          if(nodes.length&&nodes.every(n=>n.nodeType===1&&n.hasAttribute('data-ccf-owned')))return false;
          return target===sidebar||target===citation?.parentElement||nodes.some(n=>n.nodeType===1&&(n.matches(selectors)||n.querySelector(selectors)||n.contains(host)));
        });
        if(relevant)schedule();
      });
      observer.observe(document.body||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
      window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule);
    }
    return {refresh,dispose(){clearTimeout(timer);observer?.disconnect();window.removeEventListener('resize',schedule);window.removeEventListener('load',schedule);}};
  }
  globalThis.CCF_PLACEMENT={mount};
})();
