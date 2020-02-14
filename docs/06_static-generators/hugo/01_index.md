---
title: Integrating with Hugo
---

Unlike other static site generators written in other languages, Hugo doesn't offer any way to extend its features with plugins. To overcome this limitation DatoCMS offers a Javascript-based CLI tool that makes it extremely convenient to transform the content stored in your administrative area into local:

* Hugo [posts](https://gohugo.io/content/organization/) and [content types](https://gohugo.io/content/types/) (complete with Yaml frontmatter);
* Hugo [data files](https://gohugo.io/extras/datafiles/);
* Add sections to your Hugo [configuration file](https://gohugo.io/overview/configuration/).

Once content coming from DatoCMS is dumped into local files, you are free to use Hugo just like you're used to. You are in charge of specifying how DatoCMS records will be dumped into these files using a Javascript config file called `dato.config.js`.

**Disclaimer:** This guide assumes you already know what Hugo is and how it works. If you need some help getting started with Hugo, you can read the official [Hugo documentation](https://gohugo.io/overview/introduction/) and [discussion forum](https://discuss.gohugo.io/).

### Installation

Assuming you have a working NodeJS environment on your machine, you can install the `datocms-client` NodeJS package running these commands inside your Hugo project:

```bash
$ npm init
$ npm install datocms-client --save-dev
```

The npm package exposes a CLI tool: if everything worked correctly, you should now run it and see the help banner:

```bash
$ ./node_modules/.bin/dato

Usage:
  dato dump [--watch] [--verbose] [--token=<apiToken>] [--config=<file>]
  dato migrate-slugs [--token=<apiToken>] [--skip-id-prefix]
  dato check
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
$ ./node_modules/.bin/dato dump
```

---

### The config file

The `dump` command will read a file `dato.config.js` (or the file passed by the `--config` option). This file should export a function that instructs how to transform the content stored remotely on DatoCMS into local files.

Let's watch a simple example to get started:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  const content = { hello: "world" }
  root.createDataFile("data/foobar.yml", 'yaml', content)
}
```

Now run `dato dump`:

```bash
$ ./node_modules/.bin/dato dump

✔ Fetching content from DatoCMS...

* Written data/foobar.yml
```

Great! In this example, `root.createDataFile()` is a method made available to you that can generate YAML/TOML/JSON files. It's perfect to generate Hugo [data files](https://gohugo.io/extras/datafiles/).

You can also generate Hugo [posts](https://gohugo.io/content/organization/) and [types](https://gohugo.io/content/types/) with the `root.createPost()` method:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  root.createPost("content/post/my-post.md", "yaml", {
    frontmatter: {
      title: "First article",
      type: "post",
      categories: ["random"],
      weight: 4,
      date: "2012-04-06",
    },
    content: "Lorem **ipsum dolor sit amet**, consectetur adipiscing elit."
  });
}
```

If you need to place a collection of posts within a folder, you can use the `root.directory` method, so that every time the `dump` command is executed, **previous content of the directory will be erased**:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  root.directory("content/post", (dir) => {
    for (let i = 0; i < 10; i++) {
      dir.createPost(`post-${i}.md`, "yaml", {
        frontmatter: {
          title: `Article ${i}`,
          type: "post",
          categories: ["random"],
          weight: 4,
          date: "2012-04-06",
        },
        content: "Lorem **ipsum dolor sit amet**, consectetur adipiscing elit."
      });
    }
  });
}
```

Now that you know how you can create local files, the final step is to start generating them with data coming from DatoCMS. An object called `dato` is available exactly for this purpose:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {

  // inside a "post" directory...
  root.directory("content/post", (dir) => {

    // ...iterate over the "Blog post" records...
    dato.blogPosts.forEach((blogPost) => {

      // ...and create a markdown file for each article!
      dir.createPost(`${blogPost.slug}.md`, "yaml", {
        frontmatter: {
          title: blogPost.title,
          type: "post",
          categories: blogPost.categories.map(cat => cat.slug),
          date: blogPost.publishedAt,
        },
        content: blogPost.content
      });
    }
  });
}
```

Once your `dato.config.js` is ready, just run the `dato dump` command: you should see your Hugo project populated with content. Run `hugo -w` and enjoy!

Obviously, that's just a quick tour: you can learn all the details about how to access your records inside your config file in the following sections.
