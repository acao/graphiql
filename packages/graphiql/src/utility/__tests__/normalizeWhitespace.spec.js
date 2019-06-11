import { expect } from 'chai';

import { invalidCharacters, normalizeWhitespace } from '../normalizeWhitespace';

describe('QueryEditor', () => {
  it('removes unicode characters', () => {
    const result = normalizeWhitespace(invalidCharacters.join(''));
    expect(result).to.equal(' '.repeat(invalidCharacters.length));
  });
});
