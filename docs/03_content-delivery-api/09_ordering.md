---
title: Ordering records
---

When retrieving records of a specific model you can supply the `orderBy` argument for every scalar field of the model: `orderBy: <field>_ASC` or `orderBy: <field>_DESC`. For tree and sortable models, you can also order them by `position`:

Example:

```graphql
query {
  allArtists(
    orderBy: [name_ASC]
  ) {
    id
    name
  }
}
```

