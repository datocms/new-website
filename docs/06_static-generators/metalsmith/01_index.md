---
title: Integrating with Metalsmith
---

The main difference between Metalsmith and other static website generators is that, instead of being packed with lots of built-in features, it focuses on giving you an extensible architecture from which you can build your own stack, combining together a number of community plugins. 

With DatoCMS you can fully embrace the Metalsmith spirit: what we offer is a Javascript-based CLI tool that makes it extremely convenient to transform the content stored in your administrative area into local files. Once you've dumped your remote content into local files, you can keep on using Metalsmith like you're used to, taking advantage of all the already existing Metalsmith plugins. Just to make some common examples, you can:

* Transform remote content into local JSON/YAML files, and use them inside Metalsmith with [metalsmith-metadata](https://github.com/segmentio/metalsmith-metadata);
* Transform remote content into local Markdown files with frontmatter, then process them with [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) and [metalsmith-collections](https://github.com/segmentio/metalsmith-collections);

You are in charge of specifing how DatoCMS records will be dumped into local files using a Javascript config file called `dato.config.js`.

**Disclaimer:** This guide assumes you already know what Metalsmith is and how it works. If you need some help getting started with Metalsmith, you can read the official [Metalsmith documentation](http://www.metalsmith.io/), as well as [Awesome Metalsmith](https://github.com/metalsmith/awesome-metalsmith), which feature a comprehensive set of guides, videos and curated resources.

### Installation

Inside your Metalsmith project, you can install the `datocms-client` package by running these commands:

```bash
$ npm install datocms-client --save-dev
```

If everything worked correctly, you should now run dato and see something like this:

```bash
$ ./node_modules/.bin/dato
Usage:
  dato dump [--token=<apiToken>] [--config=<file>]
  dato -h | --help
  dato --version
```


The main command the `dato` CLI tool exposes is `dump`, which is the one you're going to use to fetch the records from our API and transform them into local files.

You can invoke the command like this:

```bash
$ ./node_modules/.bin/dato dump --token=READONLY_API_TOKEN
```

You can find your API token in the *Admin area > API tokens* section:

![foo](../../images/api-token.png)

#### Passing the API token as environment variable

Instead of specifying the API token as a parameter, you can pass it as an environment variable:

```bash
$ export DATO_API_TOKEN=abc123
$ ./node_modules/.bin/dato dump
```

The CLI tool also loads environment variables from a `.env` file, so you can place the token there and forget about it (just make sure not to publish your `.env` file on Github):

```bash
$ echo '.env' >> .gitignore
$ echo 'DATO_API_TOKEN=abc123' >> .env
$ ./node_modules/.bin/dato dump
```

---

#### Published vs latest versions

If you are working on development/staging environment, you might want to preview the latest version of records instead of the published one. In this case, you can add a `--preview` flag:

```bash
$ ./node_modules/.bin/dato dump --preview
```

---

### The config file

The `dump` command will read a file `dato.config.js` (or the file passed by the `--config` option). This file should contain instructions to transform the content stored remotely in DatoCMS into local files.

Inside this file, you need to export a function that takes three arguments:

* The first argument, `dato`, allows you to get content coming from your administrative area;
* The second argument, `root`, represents the root of your project and makes it easy to create local files and directories;
* The third argument, `i18n`, is useful in multi-language sites to switch between the various available locales and get back translated content;

Let's watch a simple example to get started:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  content = {
    hello: "world",
  };
  root.createDataFile("src/data/foobar.yml", "yaml", content)
};
```

Now run `dato dump`:

```bash
$ ./node_modules/.bin/dato dump

✔ Fetching content from DatoCMS...

* Written src/data/foobar.yml
```

Here, `root.createDataFile()` is a method that generates YAML/TOML/JSON files. Inside Metalsmith, you can then read this file with ie. [metalsmith-metadata](https://github.com/segmentio/metalsmith-metadata).

You can also generate Markdown posts with the `root.createPost()` method:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  root.createPost(
    "src/articles/first-article.md", "yaml", {
      frontmatter: { 
        title: "First article", 
      },
      content: "Lorem **ipsum dolor sit amet**, consectetur adipiscing elit."
    }
  );
};
```

If you need to place a collection of posts within a folder, you can use the `root.directory` method, so that every time the `dump` command is executed, **previous content of the directory will be erased**:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {

  // inside a "src/articles" directory...
  root.directory("src/articles", (articlesDir) => {

    // ...let's write 10 markdown articles, complete with frontmatter
    for (let i = 0; i < 10; i++) {

      articlesDir.createPost(
        `article-${i}.md`, "yaml", {
          frontmatter: { 
            title: `Article ${i}`, 
          },
          content: "Lorem **ipsum dolor sit amet**, consectetur adipiscing elit."
        }
      );
    }
  });
};
```

The above structure is exactly what is needed by the [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) and [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) plugins.

Now that you know how you can create local files, the final step is to start generating them with data coming from DatoCMS. The first argument called `dato` is available exactly for this purpose:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {

  // inside a "src/articles" directory...
  root.directory("src/articles", (articlesDir) => {

    // ...iterate over the "Blog post" records...
    dato.blogPosts.forEach((article) => {

      // ...and create a markdown file for each article!
      articlesDir.createPost(
        `${article.slug}.md`, "yaml", {
          frontmatter: { 
            title: article.title, 
          },
          content: article.content
        }
      );
    });
  });
};
```

Once your `dato.config.js` is ready, just run the `dato dump` command: you should see your Metalsmith project populated with new files.

Obviously, that's just a quick tour: you can learn all the details about how to access your records inside your config file in the following sections.
