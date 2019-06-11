import { expect } from 'chai';
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint';
import '../lint';
import { TestSchema } from './testSchema';
import { readFileSync } from 'fs';
import { join } from 'path';

function createEditorWithLint(lintConfig) {
  return CodeMirror(document.createElement('div'), {
    mode: 'graphql',
    lint: lintConfig ? lintConfig : true,
  });
}

function printLintErrors(queryString) {
  const editor = createEditorWithLint({
    schema: TestSchema,
  });

  return new Promise(resolve => {
    editor.state.lint.options.onUpdateLinting = errors => {
      if (errors && errors[0]) {
        if (!errors[0].message.match('Unexpected EOF')) {
          resolve(errors);
        }
      }
      resolve([]);
    };
    editor.doc.setValue(queryString);
  });
}

describe('graphql-lint', () => {
  it('attaches a GraphQL lint function with correct mode/lint options', () => {
    const editor = createEditorWithLint();
    expect(editor.getHelpers(editor.getCursor(), 'lint')).to.not.have.lengthOf(
      0,
    );
  });

  const kitchenSink = readFileSync(join(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8',
  });

  it('returns no syntactic/validation errors after parsing kitchen-sink query', async () => {
    const errors = await printLintErrors(kitchenSink);
    expect(errors).to.have.lengthOf(0);
  });
});
