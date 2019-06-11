'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');
const { cp } = require('./util');

// Non-recursively copy src/*.js to dist/*.js.flow:
readdirSync('src').forEach(entry => {
  if (entry.endsWith('.js')) {
    const source = join('src', entry);
    const destination = join('dist', `${entry}.flow`);
    cp(source, destination);
  }
});
