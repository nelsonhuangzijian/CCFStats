const status=document.getElementById('status'),access=document.getElementById('dblpAccess'),grant=document.getElementById('grantDblp'),help=document.getElementById('dblpPermissionHelp');
const origins={origins:['https://dblp.org/*']};
document.getElementById('installedVersion').textContent='v'+chrome.runtime.getManifest().version;
document.getElementById('open').onclick=async()=>{
  try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(!Number.isInteger(tab?.id))throw Error('No active tab');const result=await chrome.tabs.sendMessage(tab.id,{type:'CCF_SHOW_PANEL'});if(!result?.ok)throw Error('No profile panel');window.close();}
  catch{status.textContent='Open a Google Scholar author profile. Refresh it to retry.';}
};
async function inspect(){try{const allowed=await chrome.permissions.contains(origins);access.textContent=allowed?'DBLP lookup enabled':'DBLP lookup off · local labels available';grant.hidden=allowed;access.closest('.lookup')?.classList.toggle('off',!allowed);}catch{access.textContent='DBLP status unavailable';grant.hidden=true;}}
grant.onclick=async()=>{try{const allowed=await chrome.permissions.request(origins);help.textContent=allowed?'Access enabled. Refresh the profile.':'Local matching is still available.';}catch{help.textContent='Check extension site access.';}help.hidden=false;await inspect();};
inspect();
