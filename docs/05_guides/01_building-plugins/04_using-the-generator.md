---
title: Using the plugin generator
---

There is no need to start from scratch building a plugin, the Yeoman generator will generate all the boilerplate code you need based on your configuration.

#### Run the generator

To generate a new plugin, create the folder that will contain the skeleton of our plugin and, once inside the folder, run:

```
npx -p yo -p generator-datocms-plugin -c 'yo datocms-plugin'
```

The generator will prompt the following configuration questions:

- *Please insert the NPM package name for this new plugin (it must start with datocms-plugin-)*
- *Please insert a human name for this plugin*
- *Please insert a small description*
- *What kind of plugin is it?* - Choose between three options, field editor, field add-on, sidebar widget.
- *Which kind of fields is this plugin compatible with?* - The available field types are:
  JSON, text, boolean, float, integer, string, multiple links, single link, date, date-time, video, color, SEO, geolocation.
- *Please insert any configuration parameters this plugin requires* - The generator will open your default editor for you to edit the [configuration parameters](https://www.datocms.com/docs/plugins/creating-a-new-plugin/#configuration-parameters).
- *Please select the preferred template* - Options are Vanilla Javascript and React.

[Watch the example video](https://vimeo.com/301886498#at=0) to see the generator running.

[Read the tutorial](https://www.datocms.com/blog/how-to-create-an-inverse-relations-plugin) on how to build a custom plugin using the generator.


#### Add plugins with the generator

To add a plugin to a project, once inside the plugin's folder, run:

```
npx -p yo -p generator-datocms-plugin -c 'yo datocms-plugin:add-to-project'
```

The generator will prompt you to pick the project on which you want to install the plugin and it will set everything up for you.

If you are re-installing a plugin, remember to manually uninstall first.
