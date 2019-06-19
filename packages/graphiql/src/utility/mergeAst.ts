/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import { Kind } from 'graphql/language/kinds';
import {
  DocumentNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql';

type FragmentMap = { [key: string]: FragmentDefinitionNode };

function resolveDefinition(
  fragments: FragmentMap,
  obj: OperationDefinitionNode,
): OperationDefinitionNode {
  // if the definition is something with a selection
  if (obj.selectionSet) {
    obj.selectionSet.selections = obj.selectionSet.selections
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
      .map(
        selection =>
          (selection.kind !== Kind.FRAGMENT_SPREAD
            ? resolveDefinition(
                fragments,
                (selection as unknown) as OperationDefinitionNode,
              )
            : selection) as SelectionNode,
      );
  }

  return obj;
}

export function mergeAst(queryAst: DocumentNode): DocumentNode {
  // collect inline versions of each fragments into a single map
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
      // we have to also flatten any fragments in the definitions selection set
      .map((op: OperationDefinitionNode) => resolveDefinition(fragments, op)),
  };
}
