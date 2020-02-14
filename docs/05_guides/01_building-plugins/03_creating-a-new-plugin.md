---
title: Creating a new plugin
---

Navigate to *Settings > Plugins* in your project administrative area, and press the plus button:

![foo](../../images/plugins/plus.png)

At the bottom of the modal, you'll find a link to create a private plugin:

![foo](../../images/plugins/private.png)

This will open up a modal where you will be able to setup your new plugin:

![foo](../../images/plugins/private2.png)

* Enter a *Name* for the plugin — and a small description, if you want;
* Enter the [Entry point URL](/docs/plugins/entry-point/), which is the URL of the HTML page that will be embedded into the DatoCMS entry editor as an `<iframe>`;
* Select the types of field where it will be possible to use the plugin;
* Select the type of plugin (field editor, field add-on or sidebar widget);
* If needed, enter some [parameter definitions](/docs/guides/building-plugins/creating-a-new-plugin#configuration-parameters);

Click Save to create the plugin.

#### Configuration parameters

When building an plugin, you might feel the need to add some configuration options, so that you can reuse the same plugin with slight differences multiple times in different fields.

There are two types of configuration parameters that can be set up:

* **Global parameters** are project-wide settings and are applied to every field within the project that uses the plugin. You can set them up under the *Settings > Plugins* section;
* **Instance parameters** are field-specific settings. Every time you assing an plugin to a field you can set different parameters directly within the Presentation tab of the fields's settings.

When creating a new plugin, you can define which configuration options it will accept using a specific JSON format:

```json
{
  "global": [
    {
      "id": "developmentMode",
      "label": "Development mode?",
      "type": "boolean",
      "hint": "Enable development logs on the console"
    }
  ],
  "instance": [
    {
      "id": "maxRating",
      "label": "Maximum rating",
      "type": "integer",
      "required": true,
      "default": 5
    }
  ]
}
```

As you can see, both global and instance parameters take an array of **parameter definitions**. Every parameter definition is an object constructed as described in the table below:

Property    | Type and value                               | Required? | Remarks
------------|----------------------------------------------|-----------|--------
`id`        | String                                       | yes       | Can contain only letters and numbers
`label`     | String                                       | yes       | Human readable name of the parameter
`type`      | `boolean`, `date`, `date_time`, `float`, `integer`, `string`, `text`, `json` or `color` | yes | The type of field to offer when editing this parameter
`hint`      | String                                       | no        | Further explanation of the purpose of the parameter
`required`  | Boolean                                      | no        | Whether the parameter value needs to be provided (defaults to `false`)
`default`   | Should match type                            | no        | Default value to use for the parameter

As soon as you edit the *Parameter definitions* field, a preview of the resulting fields will be shown under the field:

![foo](../../images/plugins/parameters-preview.png)

**WARNING:** Configuration parameters can be read by anybody who is allowed to use the plugin. It's not secure to use parameters to inject access tokens that permit data manipulation. Read-only tokens can be used but keep in mind their value is not hidden.
