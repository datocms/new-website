---
title: SEO and site favicon
---

While you can fetch the content of a SEO field just like any other field,
the GraphQL API exposes on every record a much simpler `_seoMetaTags` field that
you can use to easily get HTML SEO meta tags based on the SEO information
present in the record itself:

<iframe src="https://cda-explorer.datocms.com/?embed&apitoken=faeb9172e232a75339242faafb9e56de8c8f13b735f7090964&query=%7B%0A%20%20allBlogPosts%20%7B%0A%20%20%20%20_seoMetaTags%20%7B%0A%20%20%20%20%20%20tag%0A%20%20%20%20%20%20attributes%0A%20%20%20%20%20%20content%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D"></iframe>

Meta tags are generated merging the values present in the record's *SEO meta tags*
field together with the *Global SEO settings* you can configure under *Content > Settings*:

![foo](../images/seo/global-seo.png)

If the record doesn't have a *SEO meta tags* field, the method tries to guess reasonable values by inspecting the other fields of the record (single-line strings and images).

Your page title will be composed concatenating the title of the record together with the *Title suffix* setting. If the total length of the title exceeds 60 characters, the suffix will be omitted.


### Favicon meta tags

In a similar manner, you can get the meta tags needed to properly show the site's favicon with the `_faviconMetaTags` attribute contained inside the `_site` field:

<iframe src="https://cda-explorer.datocms.com/?embed&apitoken=faeb9172e232a75339242faafb9e56de8c8f13b735f7090964&query=%7B%0A%20%20_site%20%7B%0A%20%20%20%20faviconMetaTags%20%7B%0A%20%20%20%20%20%20tag%0A%20%20%20%20%20%20attributes%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A"></iframe>

### iOS and MS app icons

If you're building an app, you can request additional meta tags with the `variants` argument:

<iframe src="https://cda-explorer.datocms.com/?embed&apitoken=faeb9172e232a75339242faafb9e56de8c8f13b735f7090964&query=%7B%0A%20%20_site%20%7B%0A%20%20%20%20faviconMetaTags(variants%3A%20%5Bicon%2C%20appleTouchIcon%2C%20msApplication%5D)%20%7B%0A%20%20%20%20%20%20tag%0A%20%20%20%20%20%20attributes%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A"></iframe>
