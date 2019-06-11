// Utility for iterating through a CodeMirror parse state stack bottom-up.
export default function forEachState(stack, fn) {
  const reverseStateStack = [];
  let state = stack;
  while (state && state.kind) {
    reverseStateStack.push(state);
    state = state.prevState;
  }
  for (let i = reverseStateStack.length - 1; i >= 0; i--) {
    fn(reverseStateStack[i]);
  }
}
