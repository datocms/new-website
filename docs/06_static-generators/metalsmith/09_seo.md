---
title: Managing SEO
---

Given a record object, you can obtain its title, description, [OpenGraph](http://ogp.me/) and [Twitter card](https://dev.twitter.com/cards/overview) meta tags with the `.seoMetaTags` method:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  root.createPost(`src/about.md`, 'yaml', {
    frontmatter: {
      title: dato.aboutPage.title,
      seoMetaTags: dato.aboutPage.seoMetaTags,
    },
    content: dato.aboutPage.content
  });
};
```

This will generate a pretty long frontmatter, contaning the complete set of meta tags for the page:

```
---
title: "About me"
seoMetaTags:
  - tagName: "title"
    content: "About me - Creative Inc."
  - tagName: "meta"
    attributes:
      property: "og:title"
      content: "About me"
  - tagName: "meta"
    attributes:
      name: "twitter:title"
      content: "About me"
  - tagName: "meta"
    attributes:
      name: "description"
      content: "Lorem ipsum sit dolor amet..."
  - tagName: "meta"
    attributes:
      name: "twitter:site"
      content: "@AlbanBikeBags"
  - tagName: "meta"
    attributes:
      property: "og:image"
      content: "https://www.datocms-assets.com/604/123-image.jpg"
  - tagName: "meta"
    attributes:
      name: "twitter:image"
      content: "https://www.datocms-assets.com/604/123-image.jpg"
  - ...
---

This is the page content, yay!!
```

Meta tags are generated merging the values present in the record's *SEO meta tags* field together with the *Global SEO settings* you can configure under *Content > Settings*:

![foo](../../images/seo/global-seo.png)

If the record doesn't have data in the *SEO meta tags* fields, the method tries to guess reasonable values by inspecting the other fields of the record (single-line strings and images).

Your page title will be composed concatenating the title of the record together with the *Title suffix* setting. If the total length of the title exceeds 60 characters, the suffix will be omitted.

```html
<html>
  <head>
    <!-- ... -->
    <% seoMetaTags.forEach(tag => { %>
      <%- tagGenerator(tag) -%>
    <% }) %>
  </head>
  <body>
    <h1><%= title %></h1>
  </body>
</html>
```


```javascript
const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown')
const tag = require('html-tag');

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(markdown())
    engine: 'ejs',
    tagGenerator({ tagName, attributes, content }) {
      return tag(tagName, attributes, content);
    }
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
```

---

### Favicon meta tags

Under the *Content > Settings* section you can also configure your website favicon:

![foo](../../images/seo/favicon.png)

You can get desktop, iOS, Android and Windows Phone favicon meta tags with the `dato.site.faviconMetaTags` method:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {

  // Create a YAML data file to store global data about the site
  root.createDataFile('src/data/settings.yml', 'yaml', {
    faviconMetaTags: dato.site.faviconMetaTags
  });
};
```

This will be the content of `src/data/settings.yml`:

```yaml
faviconMetaTags:
  - tagName: "link"
    attributes:
      rel: "apple-touch-icon"
      sizes: "57x57"
      href: "https://www.datocms-assets.com/604/123-icon.png?h=57&w=57"
  - tagName: "meta"
    attributes:
      name: "msapplication-square70x70"
      content: "https://www.datocms-assets.com/604/123-icon.png?h=70&w=70"
  - tagName: "link"
    attributes:
      rel: "icon"
      sizes: "16x16"
      href: "https://www.datocms-assets.com/604/123-icon.png?h=16&w=16"
      type: "image/png"
  - ...
```

In you Metalsmith templates, you can generate proper HTML tags from this structure like this:

```html
<html>
  <head>
    <!-- ... -->
    <% settings.faviconMetaTags.forEach(tag => { %>
      <%- tagGenerator(tag) -%>
    <% }) %>
  </head>
```


```javascript
const Metalsmith = require('metalsmith');
const metadata = require('metalsmith-metadata')
const tag = require('html-tag');

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(metadata({
    settings: 'data/settings.yml'
  }))
    engine: 'ejs',
    tagGenerator({ tagName, attributes, content }) {
      return tag(tagName, attributes, content);
    }
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
```
