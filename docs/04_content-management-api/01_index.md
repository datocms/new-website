---
title: Content Management API
---

This document is a detailed reference to DatoCMS's Content Management API.

The Content Management API is used to manage the content of your DatoCMS projects. This includes creating, updating, deleting, and fetching content of your projects. To use the Content Management API, you will need to authenticate yourself with an API token. Read more about it in [Authentication](/docs/content-management-api/#authentication).

The Content Management APIs also include many GET requests. However, it is highly recommended that you always use the [Content Delivery API](/docs/content-delivery-api/) deliver content to your public-facing web or mobile projects.

### JSON Schema

We expose a machine-readable JSON schema that describes what resources are available via the API, what their URLs are, how they are represented and what operations they support.

This schema follows the [JSON Schema format](http://json-schema.org/), combined with the draft [Validation](http://tools.ietf.org/html/draft-fge-json-schema-validation-00) and [Hypertext](http://tools.ietf.org/html/draft-luff-json-hyper-schema-00) extensions.

The latest version of the API schema will always be available at the following URL:

```
https://site-api.datocms.com/docs/site-api-hyperschema.json
```

### Official clients

DatoCMS ships with an official API client for [Javascript](https://github.com/datocms/js-datocms-client) and [Ruby](https://github.com/datocms/ruby-datocms-client).
In this document you will find examples of usage with both clients for each endpoint the API exposes.

Both clients are built upon the API [JSON Schema](/docs/content-management-api/#schema), so they're guaranteed to be up-to-date with the API itself.
