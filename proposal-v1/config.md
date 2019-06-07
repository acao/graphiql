# GraphiQL Configuration Interface

## Example Config (FS Plugins)

### minimal (likely) with preset

```json5
{
  title: "Foo Company API",
  logo: "https://foocompany/logo.png",
  href: "https://api.foocompanhy/graphql",
  presets: [
    [
      'graphql-playground:reccomended', {
        autoPrettify: off,
        storage: 'localforage',
        queryLogger: {
          rewind: true
        }
    ]
  ],
  overrides: [
    ["http-headers",
      {
        get: {
          X-tenant: "{ClientId}",
          Authorization: "Bearer {ApiToken}",
        },
        post: {
          X-tenant: "{ClientId}",
          Authorization: "Bearer {ApiToken}",
        },
      }
    ]
  ]
}
```

## without presets

```json5
{
  title: "Foo Company API",
  logo: "assets/logo.png",
  help: "docs/help.md",
  href: "https://api.foocompany.com/graphql", # or
  hrefs: [
    "https://api.foocompany.com/graphql",
    "https://extensions.foocompany.com/graphql",
  ],
  plugins: [
    ["autocomplete-queries", {
      
    }], # disable a default plugin
    ["autocomplete-variables", false], # disable a default plugin
    ["http-headers", {
      get: {
        X-tenant: "{ClientId}",
        Authorization: "Bearer {ApiToken}",
      },
      post: {
        X-tenant: "{ClientId}",
        Authorization: "Bearer {ApiToken}",
      },
    }],
    "auto-prettify",
    ["query-logger", { # enables query logger tab
      rewind: false
    }], 
    "editor-modes", # allows you to pick from vim, emacs, etc keymap modes
  ],
  components: {
    layout: "components/Layout.tsx",
    logo: "components/Logo.tsx",
  }
}
```


### Example Config (if we have runtime enabled config and plugins?)

```js

export default async () => {
  const FooLogoComponent = await import('https://foo.com/logocomponent.js')

  return {
    "title": "Foo Company API",
    "logo: "https://foocompany/logo.png",
    "components": {
      logo: FooLogoComponent
    }
  }
}
```
