---
title: Modular content fields
---

**Note** This guide assumes you have a basic knowledge of how Modular content fields work in DatoCMS. If this is not the case, please read [this introduction](/docs/content-modelling/modular-content) first.

Suppose a `blog_post` model has a modular-content field called `content`, which in turn accepts the following models as [building-blocks](/docs/content-modelling/modular-content):

* Model `blog_post_text_block`: made of a `text` field (*multi-paragraph text*);
* Model `blog_post_quote_block`: made of a `quote` field (*multi-paragraph text*) and `author` field (*single-line string*);
* Model `blog_post_gallery_block`: made of a `gallery` field (*image gallery*);

A modular-content field works much like a [*multiple links* field](/docs/metalsmith/links), as it returns an array of the inner records. In your `dato.config.js` file you can dump a modular-content field inside the frontmatter of a post like this:

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
            author: article.author.name,
            content: article.content.toMap()
          }
        }
      );
    });
  });
};
```

Depending on your static generator, you can then use the `content` key present in the frontmatter of the article to iterate over the blocks and present them in the page. Something like this:

```html
<article>
  <header>
    <h1><%= title %></h1>
    <p><%= author %></p>
  </header>
  <% content.forEach((record) => { %>
    <% if (record.itemType === "blog_post_text_block") { %>
      <div>
        <%= record.text %>
      </div>
    <% } else if (record.itemType === "blog_post_quote_block") { %>
      <blockquote>
        <%= record.quote %>
        <footer>
          <cite><%= record.author %></cite>
        </footer>
      </blockquote>
    <% } else if (record.item_type.api_key === "blog_post_gallery_block") { %>
      <div class="gallery">
        <% record.gallery.forEach((image) => { %>
          <img src="<%= image.url() %>" alt="<%= image.alt %>" title="<%= image.title %>" />
        <% }) %>
      </div>
    <% } %>
  <% }) %>
</article>
```
