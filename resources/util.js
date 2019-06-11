/**
 *  @flow
 */

'use strict';

const { execFileSync } = require('child_process');
const { createReadStream, createWriteStream } = require('fs');

function cp(source, destination) {
  createReadStream(source).pipe(createWriteStream(destination));
}

function exec(executable, ...args) {
  print(execFileSync(executable, args).toString());
}

function print(string) {
  process.stdout.write(string);
}

module.exports = { cp, exec, print };
