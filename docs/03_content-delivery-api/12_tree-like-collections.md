---
title: Tree-like collections
---

If you have [tree-like collections](/docs/content-modelling/trees) you can use
the `children` and `parent` attributes to find the top-level objects of the
collection and then navigate in depth:

```graphql
query {
  allCategories(filter: {parent: {exists: false}}) {
    name
    children {
      name
      children {
        name
        children {
          name
        }
      }
    }
  }
}
```
