import { CharacterStream, onlineParser } from 'graphql-language-service-parser';

export default function runParser(sourceText, parserOptions, callbackFn) {
  const parser = onlineParser(parserOptions);
  const state = parser.startState();
  const lines = sourceText.split('\n');

  lines.forEach(line => {
    const stream = new CharacterStream(line);
    while (!stream.eol()) {
      const style = parser.token(stream, state);
      callbackFn(stream, state, style);
    }
  });
}
