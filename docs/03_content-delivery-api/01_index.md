---
title: Content Delivery API
---

This document is a detailed reference to DatoCMS's Content Delivery API.

The Content Delivery API is used to retrieve content from one of your DatoCMS projects and deliver it to your web or mobile projects. If you are looking for APIs to manage content, you should use the [Content Management API](/docs/content-management-api/).

Our APIs serve content via a powerful and robust content delivery network (CDN). Multiple datacenters around the world store a cached copy of your content. When a page request is made, the content is delivered to the user from the nearest server. This greatly accelerates content delivery and reduces latency.

### Why GraphQL?

The Content Delivery API is written in GraphQL, which offers a number of advantages over classic REST APIs:

#### Strongly typed schema

Many developers have found themselves in situations where they needed to work with deprecated API documentation, lacking proper ways of knowing what operations are supported by an API and how to use them. GraphQL clearly defines the operations supported by the API, including input arguments and possible responses, offering an unfailing contract that specifies the capabilities of an API.

#### No more over-fetching and under-fetching

Developers often describe the major benefit of GraphQL as the fact that clients can retrieve exactly the data they need from the API. They don’t have to rely on REST endpoints that return predefined and fixed data structures. Instead, the client can dictate the shape of the response objects returned by the API.

#### Fewer roundtrips

One of the major issues of REST is that, in order to get the data you need, you are forced to call a number of different endpoints. Each API request to pull a resource is a separate HTTP request-response cycle. Fetching complicated data requires multiple round-trips between the client and server to render even a single view. On the contrary, GraphQL enables you to call several related functions without multiple round-trips.

