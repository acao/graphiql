/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { KeyMod, KeyCode } from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { GraphQLType } from 'graphql';
import { useSessionContext } from '../api/providers/GraphiQLSessionProvider';
import { useEditorsContext } from '../api/providers/GraphiQLEditorsProvider';

type QueryEditorProps = {
  onEdit?: (value: string) => void;
  readOnly?: boolean;
  onHintInformationRender: (elem: HTMLDivElement) => void;
  onClickReference?: (reference: GraphQLType) => void;
  onCopyQuery?: () => void;
  onPrettifyQuery?: () => void;
  onMergeQuery?: () => void;
  onRunQuery?: () => void;
  editorTheme?: string;
  operation?: string;
};

/**
 * QueryEditor
 *
 * Maintains an instance of CodeMirror responsible for editing a GraphQL query.
 *
 * Props:
 *
 *   - schema: A GraphQLSchema instance enabling editor linting and hinting.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *   - readOnly: Turns the editor to read-only mode.
 *
 */
export function QueryEditor(props: QueryEditorProps) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const [ignoreChangeEvent, setIgnoreChangeEvent] = React.useState(false);
  const cachedValueRef = React.useRef<string>(props.operation ?? '');

  const session = useSessionContext();
  const { loadEditor } = useEditorsContext();

  // function _onKeyUp(_cm: monaco.editor.IStandaloneCodeEditor, event: KeyboardEvent) {
  //   if (AUTO_COMPLETE_AFTER_KEY.test(event.key) && editorRef.current) {
  //     // @TODO recreat this in monaco
  //     //  editorRef.current.execCommand('autocomplete');
  //   }
  // }

  React.useEffect(() => {
    require('monaco-graphql/esm/monaco.contribution');

    // Lazily require to ensure requiring GraphiQL outside of a Browser context
    // does not produce an error.
    const editor = (editorRef.current = monaco.editor.create(
      divRef.current as HTMLDivElement,
      {
        value: session?.operation?.text ?? '',
        language: 'graphqlDev',
        automaticLayout: true,
      },
    ));
    if (!editor) {
      return;
    }
    loadEditor('operation', editor);
    editor.onDidChangeModelContent(() => {
      if (!ignoreChangeEvent) {
        cachedValueRef.current = editor.getValue();
        session.changeOperation(cachedValueRef.current);
      }
    });
    const opAction: monaco.editor.IActionDescriptor = {
      id: 'graphql-run',
      label: 'Run Operation',
      contextMenuOrder: 0,
      contextMenuGroupId: 'graphql',
      keybindings: [
        // eslint-disable-next-line no-bitwise
        KeyMod.CtrlCmd | KeyCode.Enter,
      ],
      run: async () => session.executeOperation(),
    };

    editor.addAction(opAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIgnoreChangeEvent(true);
    const editor = editorRef.current;
    const op = session?.operation?.text;
    if (editor && op && op !== cachedValueRef.current) {
      const thisValue = op || '';
      cachedValueRef.current = thisValue;
      editor.setValue(thisValue);
    }
    setIgnoreChangeEvent(false);
  }, [session, session.operation, session.operation.text]);

  return (
    <section className="query-editor" aria-label="Query Editor" ref={divRef} />
  );
}

// /**
//  * Public API for retrieving the DOM client height for this component.
//  */
// QueryEditor.getClientHeight = () => {
//   return this._node && this._node.clientHeight;
// };
