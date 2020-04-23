import * as React from 'react';
import { Fetcher } from './types';

import { GraphQLParams, SessionState, EditorContexts } from './types';

import {
  SessionAction,
  SessionActionTypes,
  operationRequestAction,
  operationSucceededAction,
  variableChangedAction,
  operationChangedAction,
  editorLoadedAction,
  operationErroredAction,
} from './sessionActions';
import { observableToPromise } from '../utility/observableToPromise';

export type SessionReducer = React.Reducer<SessionState, SessionAction>;
export interface SessionHandlers {
  changeOperation: (operation: string) => void;
  changeVariables: (variables: string) => void;
  executeOperation: (operationName?: string) => Promise<void>;
  operationErrored: (error: Error) => void;
  editorLoaded: (context: EditorContexts, editor: CodeMirror.Editor) => void;
  dispatch: React.Dispatch<SessionAction>;
}

export const initialState: SessionState = {
  sessionId: 0,
  operation: { uri: 'graphql://graphiql/operations/0.graphql' },
  variables: { uri: 'graphql://graphiql/variables/0.graphql' },
  results: { uri: 'graphql://graphiql/results/0.graphql' },
  currentTabs: {
    operation: 0,
    variables: 0,
    results: 0,
  },
  operationLoading: true,
  operationError: null,
  operations: [],
  // @ts-ignore
  editors: {},
};

export const initialContextState: SessionState & SessionHandlers = {
  executeOperation: async () => {},
  changeOperation: () => null,
  changeVariables: () => null,
  operationErrored: () => null,
  dispatch: () => null,
  editorLoaded: () => null,
  ...initialState,
};

export const SessionContext = React.createContext<
  SessionState & SessionHandlers
>(initialContextState);

export const useSessionContext = () => React.useContext(SessionContext);

const sessionReducer: SessionReducer = (state, action) => {
  switch (action.type) {
    case SessionActionTypes.OperationRequested:
      return {
        ...state,
        operationLoading: true,
      };
    case SessionActionTypes.EditorLoaded: {
      const { context, editor } = action.payload;
      return {
        ...state,
        editors: {
          ...state.editors,
          [context as EditorContexts]: editor,
        },
      };
    }
    case SessionActionTypes.OperationChanged: {
      const { value } = action.payload;
      return {
        ...state,
        operation: {
          ...state.operation,
          text: value,
        },
      };
    }
    case SessionActionTypes.VariablesChanged: {
      const { value } = action.payload;
      return {
        ...state,
        variables: {
          ...state.variables,
          text: value,
        },
      };
    }
    case SessionActionTypes.OperationSucceeded: {
      const { result } = action.payload;
      return {
        ...state,
        results: {
          ...state.results,
          text: JSON.stringify(result, null, 2),
        },
        operationError: null,
      };
    }
    case SessionActionTypes.OperationErrored: {
      const { error } = action.payload;
      return {
        ...state,
        operationError: error,
        results: {
          ...state.results,
          text: undefined,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export type SessionProviderProps = {
  sessionId: number;
  fetcher: Fetcher;
  session?: SessionState;
  children: React.ReactNode;
};

export function SessionProvider({
  sessionId,
  fetcher,
  session,
  children,
}: SessionProviderProps) {
  const [state, dispatch] = React.useReducer<SessionReducer>(
    sessionReducer,
    initialState,
  );

  const operationErrored = React.useCallback(
    (error: Error) => dispatch(operationErroredAction(error, sessionId)),
    [dispatch, sessionId],
  );

  const editorLoaded = React.useCallback(
    (context: EditorContexts, editor: CodeMirror.Editor) =>
      dispatch(editorLoadedAction(context, editor)),
    [dispatch],
  );

  const changeOperation = React.useCallback(
    (operationText: string) =>
      dispatch(operationChangedAction(operationText, sessionId)),
    [dispatch, sessionId],
  );

  const changeVariables = React.useCallback(
    (variablesText: string) =>
      dispatch(variableChangedAction(variablesText, sessionId)),
    [dispatch, sessionId],
  );

  const executeOperation = React.useCallback(
    async (operationName?: string) => {
      try {
        dispatch(operationRequestAction());
        const fetchValues: GraphQLParams = {
          query: state.operation?.text ?? '',
        };
        if (state.variables?.text) {
          fetchValues.variables = state.variables.text as string;
        }
        if (operationName) {
          fetchValues.operationName = operationName as string;
        }
        const result = await observableToPromise(fetcher(fetchValues));
        dispatch(operationSucceededAction(result, sessionId));
      } catch (err) {
        console.error(err);
        operationErrored(err);
      }
    },
    [
      dispatch,
      fetcher,
      operationErrored,
      sessionId,
      state.operation,
      state.variables,
    ],
  );

  return (
    <SessionContext.Provider
      value={{
        ...state,
        ...session,
        executeOperation,
        changeOperation,
        changeVariables,
        operationErrored,
        editorLoaded,
        dispatch,
      }}>
      {children}
    </SessionContext.Provider>
  );
}
