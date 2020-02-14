---
title: Publishing plugins
---

If you've [created a new plugin](/docs/guides/building-plugins/creating-a-new-plugin), we strongly encourage you to share it with the community as an [npm](https://www.npmjs.com/) package, so that it will become available in our Plugins Explorer:

![foo](../../images/plugins/explorer.png)

In order to properly release a plugin, you need to make sure to fill the `package.json` with these information:

```json
{
  "name": "datocms-plugin-foobar",
  "version": "0.0.1",
  "homepage": "https://github.com/mark/foobar#readme",
  "description": "Add a small description for the plugin here",
  "keywords": ["datocms-plugin"],
  "datoCmsPlugin": {
    "title": "Plugin title",
    "previewImage": "docs/preview.gif",
    "entryPoint": "dist/index.html",
    "fieldTypes": ["json"],
    "pluginType": "sidebar",
    "parameters": {
      "global": [ ... ],
      "instance": [ ... ]
    }
  },
  "devDependencies": { ... },
  "dependencies": { ... }
}
```

The following table describes the properties that can be set on the file:

Property                     | Mandatory? | Type           | Description
-----------------------------| ---------- |----------------|------------
`name`                       | ✓          | String         | Npm package name
`version`                    | ✓          | String         | Plugin version
`description`                | ✓          | String         | Short description of what the plugin does
`homepage`                   |            | String         | URL of the plugin homepage, will be shown in the Plugin Explorer
`keywords`                   | ✓          | Array<String>  | Plugin keywords, useful to help users find your plugin
`datoCmsPlugin.title`        | ✓          | String         | Plugin title
`datoCmsPlugin.previewImage` |            | String         | Relative path to a plugin preview image (better if it's a GIF)
`datoCmsPlugin.coverImage`   |            | String         | Relative path to a cover image (will be used in the [Plugins explorer](https://www.datocms.com/plugins/) page)
`datoCmsPlugin.entryPoint`   | ✓          | String         | Relative path to the plugin entry point
`datoCmsPlugin.pluginType`   | ✓          | String         | The type of plugin
`datoCmsPlugin.fieldTypes`   | ✓          | Array<String>  | The types of field the plugin can be used with
`datoCmsPlugin.parameters`   | ✓          | Hash           | Configuration parameters for the plugin

Make sure to follow these rules:

* `name` MUST be prefixed with `datocms-plugin`;
* `datoCmsPlugin.entryPoint`, `datoCmsPlugin.previewImage` and `datoCmsPlugin.coverImage` must be files contained in the package, and need to be defined as relative paths to the package root;
* `keywords` MUST contain the `datocms-plugin` keyword, otherwise the plugin won't be visible in the Plugin explorer;
* `datoCmsPlugin.fieldTypes` MUST contain one or more of the following values: `boolean`, `date`, `date_time`, `float`, `integer`, `string`, `text`, `lat_lon`, `json`, `seo`, `link`, `links`, `video`, `color`;
* `datoCmsPlugin.pluginType` MUST be one of the following values: `field_editor`, `field_addon` or `sidebar`;
* `datoCmsPlugin.parameters` MUST follow the syntax detailed in the [Configuration parameters](/docs/guides/building-plugins/creating-a-new-plugin#configuration-parameters) section of this guide.

### Requiring external JS/CSS inside of your entrypoint

We'll use [unpkg.com](https://unpkg.com/) to serve the entrypoint as an iframe, so ie. if your plugin is called `datocms-plugin-foobar` and the entry point specified in the `package.json` is `dist/index.html`, the URL that will be loaded will be something like this:

```
https://unpkg.com/datocms-plugin-foobar/dist/index.html
```

This means that if the page you requires a JS file with an absolute path like `/js/bundle.js` then it won't work, as the final URL will be `https://unpkg.com/js/bundle.js`, which will be non-existent. Make sure that any external resource you require is expressed as a relative path to the HTML page!
