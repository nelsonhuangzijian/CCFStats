(async()=>{
 const out=document.querySelector('#results');let passed=0;
 const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify(a)+' != '+JSON.stringify(b));};
 const wait=async fn=>{const end=Date.now()+6000;while(!fn()){if(Date.now()>end)throw Error('Timed out');await new Promise(r=>setTimeout(r,25));}};
 const test=async(n,fn)=>{await fn();passed++;out.textContent+='PASS '+n+'\n';};
 try{
 await wait(()=>globalThis.CCF_WIDGET?.host.shadowRoot.querySelector('#names').value);
 const w=CCF_WIDGET.host.shadowRoot,$=id=>w.getElementById(id),range=(from,to)=>{for(const [id,v] of [['from',from],['to',to]]){$(id).value=v;$(id).dispatchEvent(new Event('change'));}},done=()=>$('lookupProgress').textContent.includes('Statistics complete');
 await test('Manual start queries only unknown publications within chosen years',async()=>{range('2024','2025');$('scan').click();await wait(done);eq(yearRequests,['2024','2025']);eq($('lookupProgress').textContent.includes('7/7'),true);});
 await test('Narrowing and pending expansion issue no new lookup requests',()=>{range('2025','2025');range('2023','2025');eq(yearRequests,['2024','2025']);eq(CCF_WIDGET.dirty,true);eq($('yearScope').textContent,'Counted: 2025');});
 await test('Expanded Update reuses earlier results and queries only the added year',async()=>{$('scan').click();await wait(done);eq(yearRequests,['2024','2025','2023']);eq($('lookupProgress').textContent.includes('9/9'),true);});
 await test('Covered-range switching and recalculation do not repeat completed lookups',async()=>{range('2024','2025');range('2023','2025');$('scan').click();await wait(done);eq(yearRequests,['2024','2025','2023']);});
 await test('Separate counted intervals do not silently cover the gap',async()=>{$('rankC').click();range('2023','2023');$('scan').click();await wait(done);range('2025','2025');eq(CCF_WIDGET.dirty,true);$('scan').click();await wait(done);range('2023','2025');eq(CCF_WIDGET.dirty,true);eq($('yearScope').textContent,'Counted: 2025');range('2023','2023');eq(CCF_WIDGET.dirty,false);});
 await test('Rank changes stay pending even when cancelling a year expansion',()=>{$('rankB').click();range('2023','2025');range('2023','2023');eq(CCF_WIDGET.dirty,true);eq($('scan').textContent,'Update statistics');});
 await test('Browse completion does not query uncounted years before expanded Update',async()=>{
 const before=yearRequests.slice(),row=document.createElement('tr');row.className='gsc_a_tr';row.innerHTML='<td class="gsc_a_t"><a class="gsc_a_at" href="/citations?citation_for_view=lookup:2022">Synthetic unknown venue 2022</a><div class="gs_gray">San Zhang, Alan Li</div><div class="gs_gray">Unrecognized Venue</div></td><td class="gsc_a_y">2022</td>';document.querySelector('#gsc_a_b').append(row);$('autoLookup').click();await new Promise(r=>setTimeout(r,300));eq(yearRequests,before);range('2022','2023');await new Promise(r=>setTimeout(r,250));eq(yearRequests,before);eq($('yearScope').textContent,'Counted: 2023');$('scan').click();await wait(done);eq(yearRequests,[...before,'2022']);
 });
 out.textContent+=passed+' year network/scope tests passed\n';
 }catch(e){out.textContent+='FAIL '+e.stack+'\n';}
})();
