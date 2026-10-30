"""Build the Scholar-only extension using Python's standard library."""
from pathlib import Path
import json, shutil, zipfile
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'src'
manifest=json.loads((SOURCE/'manifest.json').read_text())
assert manifest['manifest_version']==3
assert all('scholar.google.' in pattern for entry in manifest['content_scripts'] for pattern in entry['matches'])
version=manifest['version'];name=f'ccf-scholar-{version}'
dest=ROOT/'dist'/name;dest.mkdir(parents=True,exist_ok=True)
# Remove the obsolete notice name when rebuilding an existing output folder.
(dest/'THIRD_PARTY_LICENSES.txt').unlink(missing_ok=True)
(dest/'THIRD_PARTY_LICENSES.md').unlink(missing_ok=True)
files={'manifest.json','popup.html','popup.css','popup.js','privacy.html','ThirdPartyLicenses.md','LICENSE',manifest['background']['service_worker']}
files.update(manifest['icons'].values())
for entry in manifest['content_scripts']:files.update(entry['js'])
for rel in files:
 target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(SOURCE/rel,target)
archive=dest.parent/(name+'.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for rel in sorted(files):z.write(dest/rel,rel)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None and 'manifest.json' in z.namelist()
 assert all(z.read(rel)==(SOURCE/rel).read_bytes() for rel in files)
print(f'{archive.name}: {len(files)} files verified')
