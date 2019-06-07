# Plugins

## Should
- Have own configuration
  - How to validate own config?
  - Supply a GraphQL schema for configuration settings?
  - Config provided as json, programatically or via the UI?
- Have dependencies?
- Utilize an API
  - `useEffects` wrapper?
  - `useContext` or `useReducer` wrapper?

## Thin, Vanilla JS layer
In theory, all of the below could be non-react dependent.
But would it be feasible, or make sense?

- plugin registry/loader
- API interface for plugins that handles editor and component events
- ability to render non-react panel panes and other components

## Loading Plugins in Browser Runtime
Do the benefits of this really outweigh the constraints?

### Constraints:
- No TypeScript/Static checking of plugins possible
- No filesytem available
- Assets all must be precompiled, bundled, and how?
- Module system constraints
- How would third party dependencies be bundled? In repeat?
  - For e.g., if multiple plugins used, say, apollo client, how to load this dependency only once?
- How would additional assets be provisioned?

### Considerations
- Would need to be exporeted a single object literal, likely?
- What module system would be used? Would this constrain defintion of plugins?
- Offline usage would require webworkers to dynamically cache all assets for offline uses
- Would System JS take care of most of the module concerns?
