---
title: SDK Reference
---

If you require the script from the web without any module system you can include the SDK like this:

```html
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://unpkg.com/datocms-plugins-sdk"></script>
</head>
<body>
  <input type="text" />
  <script type="text/javascript">
    DatoCmsPlugin.init(function(plugin) {
      /* ... */
    });
  </script>
</body>
</html>
```

If you use Webpack or Browserify, you'll need to require the [`datocms-plugins-sdk` npm package](https://www.npmjs.com/package/datocms-plugins-sdk):

```js
const DatoCmsPlugin = require('datocms-plugins-sdk');

DatoCmsPlugin.init(function(plugin) {
  /* ... */
});
```

The SDK exposes the `DatoCmsPlugin.init()` method, which is the main entry point for all plugin related code. The `.init` method also returns a Promise, so the following code is equivalent:

```js
DatoCmsPlugin.init()
  .then(function(plugin) {
    /* ... */
  });
```

#### Need some examples? :balloon:

If you have doubts regarding how to structure the logic of your plugin, please take a look at some examples we already made available in our [Github repository](https://github.com/datocms/plugins/tree/master/).

### Table of Contents

### Plugin options

#### `plugin.site`

Returns information about the current DatoCMS project. The object takes the same format as the [CMA Site object](/docs/content-management-api/resources/site).

```js
// returns the API identifier of the current model
console.log(plugin.site.attributes.name);
```

#### `plugin.itemType`

Returns information about of the current DatoCMS model. The object takes the same format as the [CMA Model object](/docs/content-management-api/resources/item-type).

```js
// returns the API identifier of the current model
console.log(plugin.itemType.attributes.api_key);
```

#### `plugin.itemTypes`

Returns all the models of the current DatoCMS project, indexed by ID. The objects take the same format as the [CMA Model object](/docs/content-management-api/resources/item-type).

```js
// returns info about all the models of the current DatoCMS project

plugin.site.relationships.item_types.data.forEach(function(link) {
  console.log(plugin.itemTypes[link.id].attributes.api_key);
});
```

#### `plugin.fields`

Returns all the fields of the current DatoCMS project, indexed by ID. The objects take the same format as the [CMA Field object](/docs/content-management-api/resources/field).

```js
// returns info about all the fields of the current model

plugin.itemType.relationships.fields.data.forEach(function(link) {
  console.log(plugin.fields[link.id].attributes.api_key);
});
```

#### `plugin.itemId`

Returns the ID of the record the plugin is attached to.

```js
// returns the ID of the record
console.log(plugin.itemId);
```

#### `plugin.field`

Returns the fields the plugin is attached to. The object takes the same format as the [CMA Field object](/docs/content-management-api/resources/field).

```js
// returns info about the field
console.log(plugin.field.attributes.api_key);
```

#### `plugin.currentUser`

Returns information about of the current DatoCMS user. It can either be an [Account](/docs/content-management-api/resources/user) or an [Editor](/docs/content-management-api/resources/user) object.

```js
// returns the email of the current user
console.log(plugin.currentUser.attributes.email);
```

#### `plugin.users`

Returns all the users of the current DatoCMS project, indexed by ID. The objects take the same format as the [CMA Editor object](/docs/content-management-api/resources/user).

#### `plugin.disabled`

Returns whether the field must be disabled or not.

```js
const input = document.querySelector("input");
input.disabled = plugin.disabled;
```

#### `plugin.parameters`

Returns the [configuration parameters](/docs/guides/building-plugins/creating-a-new-plugin#configuration-parameters) values for the plugin.

```js
console.log(plugin.parameters);

// returns parameters in the following shape:
// {
//   global: {
//     developmentMode: true
//   },
//   instance: {
//     sentences: 2
//   }
// }
```

#### `plugin.locale`

The current locale of a field the plugin is attached to.

```js
// returns ie. "en_US"
console.log(plugin.locale);
```

#### `plugin.fieldPath`

Returns the path of the field the plugin is attached to. Useful to set or get the value of the field itself:

```js
// get field's current value
console.log(plugin.getFieldValue(plugin.fieldPath));

// change field's current value
plugin.setFieldValue(plugin.fieldPath, 'New value!');
```

#### `plugin.placeholder`

Returns the default placeholder for the field the plugin is attached to.

```js
const input = document.querySelector("input");
input.placeholder = plugin.placeholder;
```

#### `plugin.theme`

Returns the site current color scheme.

```js
console.log(plugin.theme);

// returns the color scheme in the following form:
// {
//   accentColor: 'rgb(20, 179, 204)',
//   darkColor: 'rgb(47, 59, 59)',
//   lightColor: 'rgb(227, 249, 252)',
//   primaryColor: 'rgb(20, 152, 172)',
//   semiTransparentAccentColor: 'rgb(20, 179, 204, 0.1)',
// }
```

### Plugin methods

#### `plugin.getFieldValue(...pathChunks)`

Returns the value of a specific field. To get the value of the current field the plugin is attached to, use the [`plugin.fieldPath`](#pluginfieldpath) option.

```js
// get the value of the 'title' field
console.log(plugin.getFieldValue('title'));

// if the field is multi-language, both of these methods are fine:
console.log(plugin.getFieldValue('title.en'));
console.log(plugin.getFieldValue('title', 'en'));

// get field's current value
console.log(plugin.getFieldValue(plugin.fieldPath));
```

#### `plugin.setFieldValue(...pathChunks, newValue)`

Sets the value of a specific field.

The type of the value must match the expected field type. For example, if the plugin is attached to a "single-line string" field you must pass a string.

The method returns a Promise that resolves once the change has been acknowledged by the DatoCMS webapp.

You can get the path of the field the plugin is attached to using the method [`plugin.fieldPath`](#pluginfieldpath).

```js
// set the value of the 'title' field
plugin.setFieldValue('title', 'New title!');

// if the field is multi-language, both of these methods are fine:
plugin.setFieldValue('title.en', 'New title!');
plugin.setFieldValue('title', 'en', 'New title!');

// set field's current value
plugin.setFieldValue(plugin.fieldPath, 'New title!');

// if multi-language, and you need to set the value of the field in a different locale (ie. `it`):
const alternativeLanguageFieldPath = plugin.fieldPath
  .replace(new RegExp(`\.${plugin.locale}$`), `.it`);

plugin.setFieldValue(alternativeLanguageFieldPath, 'New title!');
```

#### `plugin.addFieldChangeListener(...pathChunks, callbackFn)`

Calls the `callbackFn` every time the value of the field specified is changed by an external event (e.g. when multiple editors are working on the same entry) or when `setFieldValue()` is called.

The method returns a function you can call to stop listening to changes.

You can get the path of the field the plugin is attached to using the method [`plugin.fieldPath`](#pluginfieldpath).

```js
const input = document.querySelector("input");

const unsubscribe = plugin.addFieldChangeListener(plugin.fieldPath, (newValue) => {
  input.value = newValue;
});

// stop being notified
unsubscribe();
```

#### `plugin.addChangeListener(...pathChunks, callbackFn)`

Calls the `callbackFn` every time one of the plugin options is changed by an external event. The method returns a function you can call to stop listening to changes.

```js
const input = document.querySelector("input");

const unsubscribe = plugin.addFieldChangeListener('disabled', (newValue) => {
  input.disabled = newValue;
});

// stop being notified
unsubscribe();
```

#### `plugin.toggleField(...pathChunks, visible)`

Hides/shows a specific field. The method returns a Promise that resolves once the change has been acknowledged by the DatoCMS webapp.

You can get the path of the field the plugin is attached to using the method [`plugin.fieldPath`](#pluginfieldpath).

```js
// hide the title field
plugin.toggleField('title', false);

// show the title field
plugin.toggleField('title', true);

// if the field is multi-language, both of these methods are fine:
plugin.toggleField('title.en', true);
plugin.toggleField('title', 'en', true);
```

#### `plugin.startAutoResizer()`

Listens for DOM changes and calls `updateHeight()` when the size changes.

#### `plugin.stopAutoResizer()`

Stops resizing the iframe automatically.

#### `plugin.updateHeight()`

Calculates the body's `scrollHeight` and sets the containers height to this value.

#### `plugin.updateHeight(height)`

Sets the iframe height to the given value in pixels. `height` must be an integer.

### Dialogs

#### `plugin.createNewItem(itemTypeId)`

Opens a dialog for creating a new record. It returns a promise resolved with the newly created record or `null` if the user closes the dialog without creating anything.

```js
// open modal to create a new record of model with ID=999
plugin.createNewItem(999)
  .then(function(item) {
    if (item) {
      console.log('Item created: ', item);
    } else {
      console.log('Model closed!');
    }
  });
```

#### `plugin.editItem(itemId)`

Opens a dialog for editing an existing record. It returns a promise resolved with the edited record or `null` if the user closes the dialog without persisting any change.

```js
// open modal to edit record #4941
plugin.editItem(4941)
  .then(function(item) {
    if (item) {
      console.log('Item edited: ', item);
    } else {
      console.log('Model closed!');
    }
  });
```
