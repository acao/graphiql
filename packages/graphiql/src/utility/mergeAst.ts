/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import { Kind } from 'graphql/language/kinds';
import { DocumentNode, FragmentDefinitionNode, DefinitionNode } from 'graphql';

type FragmentMap = { [key: string]: FragmentDefinitionNode };

function resolveDefinition(fragments: FragmentMap, obj: DefinitionNode) {
  let definition = obj;
  if (definition.kind === Kind.FRAGMENT_SPREAD) {
    definition = fragments[definition.name.value];
  }

  if (definition.selectionSet) {
    definition.selectionSet.selections = definition.selectionSet.selections
      .filter(
        (selection, idx, self) =>
          selection.kind !== Kind.FRAGMENT_SPREAD ||
          idx ===
            self.findIndex(
              _selection =>
                _selection.kind === Kind.FRAGMENT_SPREAD &&
                selection.name.value === _selection.name.value,
            ),
      )
      .map(selection => resolveDefinition(fragments, selection));
  }

  return definition;
}

export function mergeAst(queryAst: DocumentNode) {
  // collect all of the fragments into a single map
  const fragments: FragmentMap = queryAst.definitions
    .filter(elem => elem.kind === Kind.FRAGMENT_DEFINITION)
    .reduce(
      (acc, frag: FragmentDefinitionNode) => ({
        ...acc,
        [frag.name.value]: {
          ...frag,
          kind: Kind.INLINE_FRAGMENT,
        },
      }),
      {},
    );

  // merge the definitions
  return {
    ...queryAst,
    definitions: queryAst.definitions
      .filter(elem => elem.kind !== Kind.FRAGMENT_DEFINITION)
      .map(op => resolveDefinition(fragments, op)),
  };
}
