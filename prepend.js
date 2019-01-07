const fs = require('fs');
const path = require('path');
const webpackConfig = require('./webpack.config');

const fpath = path.resolve(
  webpackConfig.output.path,
  webpackConfig.output.filename,
);

const content = fs.readFileSync(fpath);
fs.writeFileSync(
  fpath,
  `#!/usr/bin/env node\nvar __REAL_MODULE__ = module;\n${content}`,
);
