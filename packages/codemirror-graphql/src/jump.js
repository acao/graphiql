/* @flow */
import CodeMirror from 'codemirror';

import getTypeInfo from './utils/getTypeInfo';
import {
  getArgumentReference,
  getDirectiveReference,
  getEnumValueReference,
  getFieldReference,
  getTypeReference,
} from './utils/SchemaReference';
import './utils/jump-addon';

/**
 * Registers GraphQL "jump" links for CodeMirror.
 *
 * When command-hovering over a token, this converts it to a link, which when
 * pressed will call the provided onClick handler.
 *
 * Options:
 *
 *   - schema: GraphQLSchema provides positionally relevant info.
 *   - onClick: A function called when a named thing is clicked.
 *
 */
CodeMirror.registerHelper('jump', 'graphql', (token, options) => {
  if (!options.schema || !options.onClick || !token.state) {
    return;
  }

  // Given a Schema and a Token, produce a "SchemaReference" which refers to
  // the particular artifact from the schema (such as a type, field, argument,
  // or directive) that token references.
  const state = token.state;
  const kind = state.kind;
  const step = state.step;
  const typeInfo = getTypeInfo(options.schema, state);

  if (
    (kind === 'Field' && step === 0 && typeInfo.fieldDef) ||
    (kind === 'AliasedField' && step === 2 && typeInfo.fieldDef)
  ) {
    return getFieldReference(typeInfo);
  } else if (kind === 'Directive' && step === 1 && typeInfo.directiveDef) {
    return getDirectiveReference(typeInfo);
  } else if (kind === 'Argument' && step === 0 && typeInfo.argDef) {
    return getArgumentReference(typeInfo);
  } else if (kind === 'EnumValue' && typeInfo.enumValue) {
    return getEnumValueReference(typeInfo);
  } else if (kind === 'NamedType' && typeInfo.type) {
    return getTypeReference(typeInfo);
  }
});
