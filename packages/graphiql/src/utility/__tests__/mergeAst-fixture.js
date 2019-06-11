export const fixtures = [
  {
    desc: 'does not modify query with no fragments',
    query: `
      query Test {
        id
      }`,
    mergedQuery: `
      query Test {
        id
      }`,
  },
  {
    desc: 'inlines simple nested fragment',
    query: `
      query Test {
        ...Fragment1
      }
      
      fragment Fragment1 on Test {
        id
      }`,
    mergedQuery: `
      query Test {
        ...on Test {
          id
        }
      }`,
  },
  {
    desc: 'inlines triple nested fragment',
    query: `
      query Test {
        ...Fragment1
      }
      
      fragment Fragment1 on Test {
        ...Fragment2
      }
      
      fragment Fragment2 on Test {
        ...Fragment3
      }
      
      fragment Fragment3 on Test {
        id
      }`,
    mergedQuery: `
      query Test {
        ...on Test {
          ...on Test {
            ...on Test {
              id
            }
          }
        }
      }`,
  },
  {
    desc: 'inlines multiple fragments',
    query: `
      query Test {
        ...Fragment1
        ...Fragment2
        ...Fragment3
      }
      
      fragment Fragment1 on Test {
        id
      }
      
      fragment Fragment2 on Test {
        id
      }
      
      fragment Fragment3 on Test {
        id
      }`,
    mergedQuery: `
      query Test {
        ...on Test {
          id
        }
        ...on Test {
          id
        }
        ...on Test {
          id
        }
      }`,
  },
  {
    desc: 'removes duplicate fragment spreads',
    query: `
      query Test {
        ...Fragment1
        ...Fragment1
      }
      
      fragment Fragment1 on Test {
        id
      }`,
    mergedQuery: `
      query Test {
        ...on Test {
          id
        }
      }`,
  },
];
