---
title: Localization
---

If you have [localized fields](/docs/general-concepts/localization) you can add a `locale` argument to your single or multiple record queries to select the locale you want:

```graphql
query {
  allBlogPosts(locale: it) {
    title
  }
}
```

You can also select a locale on a per-field basis:

```graphql
query {
  allBlogPosts(locale: it) {
    title
    englishTitle: title(locale: en)
  }
}
```

If you want to get the value of a field in every locale:

```graphql
query {
  allBlogPosts {
    _allTitleLocales {
      locale
      value
    }
  }
}
```

