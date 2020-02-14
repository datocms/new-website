---
title: Filtering records
template: GraphqlFiltersPage
---

You can supply different parameters to the `filter` argument to filter the query response accordingly. The available options depend on the fields defined on the model in question.

If you supply exactly one parameter to the filter argument, the query response will only contain records that fulfill this constraint:

```graphql
query {
  allArtists(
    filter: {
      published: { eq: false }
    }
  ) {
    id
    name
    published
  }
}
```

Depending on the type of the field you want to filter by, you have access to different advanced criteria you can use to filter your query response:

```graphql
query {
  allArtists(
    filter: {
      name: { in: [ "Blank Banshee", "Gazelle Twin" ] }
    }
  ) {
    id
    name
    genre
  }
}
```

If you specify multiple conditions, they will be combined as if it was a logical _AND_ expression:

```graphql
query {
  allAlbums(
    filter: {
      { artist: { eq: "212" } },
      { releaseDate: { gt: "2016-01-01" } }
    }
  ) {
    id
    slug
    artist { name }
    coverImage { url }
  }
}
```

You can also combine _AND-like_ and `OR` logical expressions. For example, the following
query will return all the point of interest located in New York that either have
a rating greater than 4 or are a restaurant:

```graphql
query {
  allPois(
    filter: {
      address: { matches: { pattern: "new york" } },
      OR: [
        { rating: { gt: 4 } },
        { name: { matches: { pattern: "restaurant" } } },
      ]
    }
  ) {
    name
    address
    rating
  }
}
```
