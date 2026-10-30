"""Check the public Scholar package; no browser, upload or network is used."""
from pathlib import Path
import json, struct, zipfile
ROOT=Path(__file__).resolve().parents[1];source=ROOT/'src';m=json.loads((source/'manifest.json').read_text())
assert m['manifest_version']==3 and m['permissions']==['storage']
assert m['host_permissions']==['https://dblp.org/*']
assert all(p.startswith('https://scholar.google.') and p.endswith('/citations*') for c in m['content_scripts'] for p in c['matches'])
assert len(m['description'])<=132
assert 'function dblp(' not in (source/'parsers.js').read_text()
assert 'function xml(' not in (source/'parsers.js').read_text()
assert 'P.dblp(' not in (source/'content.js').read_text()
assert 'executeScript' not in (source/'popup.js').read_text()
for size,rel in m['icons'].items():
 data=(source/rel).read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n'
 assert struct.unpack('>II',data[16:24])==(int(size),int(size))
assert (source/'LICENSE').read_text()==(ROOT/'LICENSE').read_text()
assert (ROOT/'LICENSE').read_text().startswith('MIT License\n')
assert (source/'ThirdPartyLicenses.md').read_bytes()==(ROOT/'ThirdPartyLicenses.md').read_bytes()
archive=ROOT/'dist'/f'CCFStats-{m["version"]}.zip'
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None and 'manifest.json' in z.namelist()
 assert len(z.namelist())==19
 assert 'ThirdPartyLicenses.md' in z.namelist() and 'THIRD_PARTY_LICENSES.txt' not in z.namelist() and 'THIRD_PARTY_LICENSES.md' not in z.namelist()
 assert not any('tests/' in name or 'internal' in name for name in z.namelist())
 assert all(z.read(name)==(source/name).read_bytes() for name in z.namelist())
print('Scholar-only scope, permissions, PNGs and ZIP/source parity verified')
