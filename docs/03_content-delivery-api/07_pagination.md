---
title: Pagination
---

When querying records of a specific model you can supply arguments that allow you to paginate the query response. Pagination allows you to request a certain amount of records at the same time. The default limit is 20 records, and the maximum is 100.

Use `first` to limit the number of results:

```graphql
{
  allArtists(first: 5) {
    id
    name
  }
}
```

You can also skip an arbitrary amount of records by supplying the `skip` argument:


```graphql
{
  allArtists(first: 5, skip: 10) {
    id
    name
  }
}
```

Note: If you query more records than exist, your response will simply contain all records that actually do exist in that direction.

