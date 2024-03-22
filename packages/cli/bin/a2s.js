#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const run = require('../dist').run;
run(process.argv.slice(2));
