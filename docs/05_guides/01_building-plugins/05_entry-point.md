---
title: The entry point
---

A plugin is just an HTML page that will be showed inside an `<iframe>` by the DatoCMS webapp. When you [create a new plugin](/docs/guides/building-plugins/creating-a-new-plugin), you will be asked for the URL of this web page. We call this page the plugin's *entry point*.

### Skeleton code

The entry point must import the [Plugins SDK](https://github.com/datocms/plugins-sdk/), which enables the plugin to communicate with the DatoCMS web app:

```html
<script src="https://unpkg.com/datocms-plugins-sdk"></script>
```

It is also suggested to add the official SDK style sheet to get some default styling that's coherent to the DatoCMS webapp UI:

```html
<link href="https://unpkg.com/datocms-plugins-sdk/dist/sdk.css" media="all" rel="stylesheet" />
```

This is the minimal code you need to write to make a field-editor plugin that renders and updates a simple text input:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://unpkg.com/datocms-plugins-sdk"></script>
  <link href="https://unpkg.com/datocms-plugins-sdk/dist/sdk.css" media="all" rel="stylesheet" />
</head>
<body>
  <input type="text" />
  <script type="text/javascript">
    DatoCmsPlugin.init(function(plugin) {
      const input = document.querySelector("input");

      plugin.startAutoResizer()

      input.value = plugin.getFieldValue(plugin.fieldPath);

      plugin.addFieldChangeListener(plugin.fieldPath, function(newValue) {
        input.value = newValue;
      });

      input.addEventListener("change", function(e) {
        plugin.setFieldValue(plugin.fieldPath, e.target.value);
      });
    });
  </script>
</body>
</html>
```

The SDK exposes a `DatoCmsPlugin.init()`, that you can use within the page to initialize the plugin:

```js
DatoCmsPlugin.init(function(plugin) {
  // place your custom plugin code here
});
```

The `DatoCmsPlugin.init()` callback will be invoked once the plugin is ready with an `plugin` argument, which will give you all the methods you might need to get info and communicate to the main DatoCMS webapp.

While in this example we're just writing vanilla JS code, you are free to use any third-party library or advanced client-side frameworks such as React, Angular or Vue. 

If you're using Webpack, you can also include the SDK as a regular NPM package:

```js
const DatoCmsPlugin = require('datocms-plugins-sdk');

DatoCmsPlugin.init(function(plugin) {
  // place your custom plugin code here
});
```

We'll take a detailed look the methods our SDK offers and how to use them in the [next section of the guide](/docs/guides/building-plugins/sdk-reference).

### Theme colors

To make it easier for you to style plugins based on the project current theme colors, the following CSS variables will be available within the page:

* `--primary-color`, ie. `rgb(20, 152, 172)`
* `--accent-color`, ie. `rgb(20, 179, 204)`
* `--semi-transparent-accent-color`, ie. `rgb(20, 179, 204, 0.1)`
* `--light-color`, ie. `rgb(227, 249, 252)`
* `--dark-color`, ie. `rgb(47, 59, 59)`

You will also be able to access to theme colors programmatically from the Plugins SDK [plugin.theme](/docs/guides/building-plugins/sdk-reference/#plugintheme) getter.

### Need some examples?

If you have doubts regarding how to structure your entry point HTML file, please take a look at some of the plugins we already made available in our [Github repository](https://github.com/datocms/plugins/tree/master/).
