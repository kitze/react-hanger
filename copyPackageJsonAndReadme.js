const fs = require('fs');

fs.copyFileSync('package.json', './lib/package.json');
fs.copyFileSync('README.md', './lib/README.md');
fs.copyFileSync('README-ARRAY.md', './lib/README-ARRAY.md');
