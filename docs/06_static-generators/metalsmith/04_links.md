---
title: Link fields
---

Suppose our `blog_post` model has the following fields:

* `author`: *Single link* referencing a `user` record;
* `related_posts`: *Multiple links* referencing other `blog_post` records;

In this case, `blog_post.author` will return the linked `user` record (or `null`, if the relation is empty), and `blog_post.related` will return an array of `blog_post` records.

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  dato.blogPosts[0].author.fullName;   // => "Mark Smith"

  dato.blogPosts[0].related.forEach(relatedPost => {
    relatedPost.title;                  // => "Another post!"
  })
}
```

Use method chains to navigate deeply across your records' relationships:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  dato.blogPosts[0].related[0].author.name  // => "Tom Kepler"
};
```

#### Reverse lookups

You can easily find all the blog post for a specific author with this Javascript one-liner:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  const peter = dato.find("1413");
  dato.blogPosts.filter(blogPost => blogPost.author.id === peter.id);
}
```
