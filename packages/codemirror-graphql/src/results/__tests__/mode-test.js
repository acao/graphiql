import { expect } from 'chai';

import CodeMirror from 'codemirror';
import 'codemirror/addon/runmode/runmode';

import '../mode';

describe('graphql-results-mode', () => {
  it('provides correct tokens and styles after parsing', () => {
    const queryStr =
      '{ "data": { "field": "value" }, "errors": [ { "message": "bork" } ] }';
    const tokens = [];

    CodeMirror.runMode(queryStr, 'graphql-results', (token, style) => {
      if (style && style !== 'ws') {
        tokens.push([token, style]);
      }
    });

    expect(tokens).to.deep.equal([
      ['{', 'punctuation'],
      ['"data"', 'def'],
      [':', 'punctuation'],
      ['{', 'punctuation'],
      ['"field"', 'property'],
      [':', 'punctuation'],
      ['"value"', 'string'],
      ['}', 'punctuation'],
      [',', 'punctuation'],
      ['"errors"', 'def'],
      [':', 'punctuation'],
      ['[', 'punctuation'],
      ['{', 'punctuation'],
      ['"message"', 'property'],
      [':', 'punctuation'],
      ['"bork"', 'string'],
      ['}', 'punctuation'],
      [']', 'punctuation'],
      ['}', 'punctuation'],
    ]);
  });
});
