#!/usr/bin/env node

if (process && process.env) {
  process.env.GRAPHQL_NO_NAME_WARNING = true;
}

require('@babel/polyfill');
require('../dist/cli');
