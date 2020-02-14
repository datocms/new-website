---
title: Rate limits
---

API Rate limits specify the number of requests a client can make to DatoCMS APIs in a specific time frame.

By default the Management API enforces rate limits of **30 requests per 3 seconds**. Higher rate limits may apply depending on your current plan.

The following table lists all headers returned in every response by the Content Management API which give a client information on rate limiting:

<table>
  <thead>
    <tr>
      <th>Header</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>X-RateLimit-Limit</code></td><td>The maximum amount of requests which can be made in 3 seconds.</td>
    </tr>
    <tr>
      <td><code>X-RateLimit-Remaining</code></td><td>The remaining amount of requests which can be made until the next 3-seconds reset.</td>
    </tr>
    <tr>
      <td><code>X-RateLimit-Reset</code></td><td>If present, indicates the number of seconds until the next request can be made.</td>
    </tr>
  </tbody>
</table>

When a client gets rate limited, the API responds with the <code>429 Too Many Requests</code> HTTP status code and sets the value <code>X-RateLimit-Reset</code> header to an integer larger than 0 specifying the time before the limit resets and another request will be accepted.

Our Ruby and JS API clients take care of rate limit errors and will automatically retry the request after the right amount of time.

#### Reaching your plan monthly API calls limit

For projects under a paid plan, even exceeding the API call or bandwidth limits does not lead to the interruption of the service, but the payment of an additional fee commensurate with the use. For projects under a free plan, service will be temporarily disabled until the beginning of the following calendar month, unless you provide a credit card. For more details, check our [Plans, billing and pricing page](/docs/general-concepts/pricing).
