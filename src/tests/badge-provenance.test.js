(()=>{
 const E=CCF_ENGINE;let passed=0;
 const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify(a)+' != '+JSON.stringify(b));};
 const test=(name,fn)=>{try{fn();passed++;console.log('PASS '+name);}catch(e){throw Error(name+': '+e.message);}};
 const acl=CCF_CATALOG.venues.find(v=>v.abbr==='ACL'),record={venue:'ACL'};
 test('Local venue match takes precedence over existing DBLP metadata provenance',()=>{const p=E.venueStatus({venue:'ACL',source:'scholar',lookupVenueId:acl.id,lookupRecord:record});eq(p.venueMethod,'catalog');eq(p.matched.abbr,'ACL');});
 test('Search-derived and legacy cached venue IDs retain DBLP provenance',()=>{for(const lookupRecord of [record,null])eq(E.venueStatus({venue:'Unknown Conference',source:'scholar',lookupVenueId:acl.id,lookupRecord}).venueMethod,'dblp');});
 test('DBLP page link mapping is catalogue based rather than a search',()=>{eq(E.venueStatus({venue:'Unknown Conference',source:'dblp',lookupVenueId:acl.id}).venueMethod,'catalog');eq(E.venueStatus({venue:'Unknown Conference',source:'scholar',lookupVenueId:acl.id,lookupBasis:'DBLP 页面刊物链接匹配：ACL'}).venueMethod,'catalog');});
 test('Local secondary venue rules retain catalogue provenance',()=>{const p=E.venueStatus({venue:'CVPR Workshops',source:'scholar',nonCcf:true,lookupRecord:{venue:'CVPR Workshops'}});eq(p.nonCcf,true);eq(p.venueMethod,'catalog');});
 test('Unranked search results retain search provenance',()=>{const p=E.venueStatus({venue:'Unknown Venue',source:'scholar',nonCcf:true,lookupRecord:{venue:'UNKNOWN-CONF'}});eq(p.nonCcf,true);eq(p.venueMethod,'dblp');});
 test('An explicitly selected catalogue entry is not labeled as a search',()=>eq(E.venueStatus({venue:'Unknown Venue',source:'scholar'},{venueId:acl.id}).venueMethod,'catalog'));
 globalThis.CCF_BADGE_PROVENANCE_RESULTS={passed};console.log(`${passed} badge provenance tests passed`);
})();
