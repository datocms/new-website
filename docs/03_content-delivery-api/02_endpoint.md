---
title: API Endpoint
---

DatoCMS offers a single GraphQL endpoint:

```
https://graphql.datocms.com/
```

The endpoint remains constant no matter what operation you perform, and it's read only — that is, it does not offer any *mutation operation*. You can use our [Content Management API](/docs/content-management-api/) for that.

### Preview endpoint

If you have the [Draft/Published system](/docs/general-concepts/draft-published) active on some of your models, you can use a different endpoint to access records at their latest version available, instead of the currently published: this can be useful on staging environments, or your local development machine:

```
https://graphql.datocms.com/preview
```

Both endpoints offer exactly the same queries, the only thing that will change will be the returned content.

