---
title: Localization
---

Within your `dato.config.js` file, you can easily switch between your locales changing the value of `i18n.locale`:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  i18n.locale = 'en';
  dato.blogPosts[0].title;  // => "Hello world!"

  i18n.locale = 'it';
  dato.blogPosts[0].title   // => "Ciao mondo!"
};
```

If you need to temporarily switch locale, and then restore the previous value, you can use `i18n.withLocale`:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  i18n.locale = 'en';
  dato.blogPosts[0].title;  // => "Hello world!"

  i18n.withLocale('it', () => {
    i18n.locale;              // => "it"
    dato.blogPosts[0].title;  // => "Ciao mondo!"
  });

  i18n.locale;              // => "en"
  dato.blogPosts[0].title;  // => "Hello world!"
};
```


You can also obtain the list of languages of your administrative area with `i18n.availableLocales`:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  i18n.availableLocales;  // => [ 'en', 'it' ]
};
```

You can also configure the config file so that if a particular field in a specific locale is not empty, it will try to return the value for other languages.
In the following example, if a blog post does not have a title in italian, it will use the english one:

```js
module.exports = (dato, root, i18n) => {
  i18n.fallbacks = {
    it: ['en']
  };

  i18n.locale = 'it';

  dato.blogPosts[0].title;  // => "Hello world!"
}
```


Here's an complete example that creates multiple versions of your articles, one for each available locale:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {

  // inside the "src/article" directory...
  root.directory("content/article", (articlesDir) => {

    // iterate over all the administrative area languages
    i18n.availableLocales.forEach((locale) => {

      // switch to the nth locale
      i18n.withLocale(locale, () => {

        // iterate over the "Blog post" records...
        dato.blogPosts.forEach((blogPost) => {

          // ...and create a localized markdown file for each article!
          articlesDir.createPost(`${blogPost.slug}_${locale}.md`, 'yaml', {
            frontmatter: {
              title: blogPost.title,
              date: blogPost.publishedAt,
            },
            content: blogPost.content
          });
        });
      });
    });
  });
};
```
