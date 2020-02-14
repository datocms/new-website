---
title: Rate limiting
---

API Rate limits specify the number of requests a client in a specific time frame.

Since this API is meant to be used for delivering content from DatoCMS to apps,
websites and other digital products consumed by end-users, **there are no limits
enforced on requests that hit our CDN cache**. That is, you can make an unlimited
amount of cache hits.

For requests that do hit the Content Delivery API we enforce a rate limit
of 50 requests per second per API token.

Higher rate limits may apply depending on your current plan.

#### Reaching your plan monthly API calls limit

For projects under a paid plan, even exceeding the API calls or bandwidth limit
does not lead to the interruption of the service, but the payment of an additional
fee commensurate with the use. For projects under a free plan, service will be
temporarily disabled until the beginning of the following calendar month,
unless you provide a credit card.

For more details, check our [Plans, billing and pricing page](/docs/general-concepts/pricing).
