export * from './FieldDoc';
export { DocExplorer } from './DocExplorer';

const ID = 'doc-explorer-classic';

import DocExplorerGraphiQL from './DocExplorerGraphiQL';

export const plugin = {
  name: 'Doc Explorer Classic',
  sidebarTabs: [
    {
      id: ID,
      label: 'Docs',
      component: DocExplorerGraphiQL,
    },
  ],
  defaultSettings: {
    'sidebar.defaultTabId': ID,
  },
};
