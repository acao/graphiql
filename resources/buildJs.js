'use strict';

const { exec } = require('./util');

const commands = [
  'babel',
  'src',
  '--ignore',
  '**/__tests__/**',
  '--out-dir',
  'dist',
  '--root-mode',
  'upward',
];
const extraArgs = process.argv[2]
if (extraArgs) {
  commands.push(extraArgs.split(' '));
}
exec(...commands);
