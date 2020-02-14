---
title: Modular-content
---

If you have [modular-content fields](/docs/content-modelling/modular-content) 
you can use GraphQL fragments to fetch the different blocks.

Suppose a `blog_post` model has a modular content field called `content`, which in turn accepts the following [building-blocks](/docs/content-modelling/modular-content):

* Model `blog_post_text_block`: made of a `text` field (*multi-paragraph text*);
* Model `blog_post_quote_block`: made of a `quote` field (*multi-paragraph text*) and `author` field (*single-line string*);
* Model `blog_post_gallery_block`: made of a `gallery` field (*image gallery*);

This GraphQL query will do the work:

```graphql
query {
  allBlogPosts {
    title
    content {
      ... on BlogPostTextBlockRecord {
        _modelApiKey
        text
      }
      ... on BlogPostQuoteBlockRecord {
        _modelApiKey
        quote
        author
      }
      ... on BlogPostGalleryBlock {
        _modelApiKey
        gallery { url }
      }
    }
  }
}
```

