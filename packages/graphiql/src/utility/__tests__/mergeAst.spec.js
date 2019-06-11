
import { expect } from 'chai';

import { parse, print } from 'graphql';

import { mergeAst } from '../mergeAst';

import { fixtures } from './mergeAst-fixture';

describe('MergeAst', () => {
  fixtures.forEach(fixture => {
    it(fixture.desc, () => {
      const result = print(mergeAst(parse(fixture.query))).replace(/\s/g, '');
      expect(result).to.equal(fixture.mergedQuery.replace(/\s/g, ''));
    });
  });
});
