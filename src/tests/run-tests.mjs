import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const context=vm.createContext({console,URL});
for(const file of ['data/catalog.js','engine.js','resolver.js','tests/engine.test.js','tests/matching.test.js','tests/authors.test.js','tests/ccfrank.test.js','tests/venue-formats.test.js','tests/local-venues.test.js','tests/badge-provenance.test.js','tests/conference-context.test.js','tests/edition-matching.test.js','tests/bibliographic-venues.test.js'])vm.runInContext(fs.readFileSync(root+file,'utf8'),context,{filename:file});
