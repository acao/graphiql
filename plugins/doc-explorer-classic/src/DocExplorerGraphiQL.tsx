import * as React from 'react';

import { SchemaContext } from 'graphiql';

import { DocExplorer } from './DocExplorer';

/**
 * Context Conusmer for rendering DocExplorer in GraphiQL.
 */
export default function DocExplorerGraphiQL() {
  return (
    <SchemaContext.Consumer>
      {({ schema }) => <DocExplorer schema={schema} />}
    </SchemaContext.Consumer>
  );
}
