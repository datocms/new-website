---
title: Authentication
---

In order to make any Content Management API (CMA) requests, you need to first obtain a full-access API token. To retrieve this API token, enter your project administrative area (ie. http://your-project.admin.datocms.com) and go to the&nbsp; <em>Settings > API Tokens</em> section:

![foo](../images/api-token.png)

Once you have the API Token, you need to pass it as a header in each Content Management API request:

```
curl \
  -H 'Authorization: Bearer YOUR-API-TOKEN' \
  -H 'accept: application/json' \
  https://site-api.datocms.com/site
```

