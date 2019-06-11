import { expect } from 'chai';

import jsonParse from '../jsonParse';

describe('jsonParse', () => {
  function checkEscapedString(str, key, value) {
    const ast = jsonParse(str);
    expect(ast.kind).to.equal('Object');
    expect(ast.members[0].key).to.deep.equal(key);
    expect(ast.members[0].value).to.deep.equal(value);
  }

  it('correctly parses escaped strings', () => {
    checkEscapedString(
      '{ "test": "\\"" }',
      { kind: 'String', start: 2, end: 8, value: 'test' },
      { kind: 'String', start: 10, end: 14, value: '"' },
    );
    checkEscapedString(
      '{ "test": "\\\\" }',
      { kind: 'String', start: 2, end: 8, value: 'test' },
      { kind: 'String', start: 10, end: 14, value: '\\' },
    );
    checkEscapedString(
      '{ "slash": "\\/" }',
      { kind: 'String', start: 2, end: 9, value: 'slash' },
      { kind: 'String', start: 11, end: 15, value: '/' },
    );
  });
});
