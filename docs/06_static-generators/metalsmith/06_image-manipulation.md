---
title: Image manipulation
---

Every image/file you upload in DatoCMS is stored on [Imgix](https://www.imgix.com/), a super-fast CDN optimized for image delivery.

By adding some parameters to your image URL, you can enhance, resize and crop images, compress them and change format for better performance, create complex compositions, and extract useful metadata. The transformations happen on-the-fly and get cached on the CDN as well for future reuse.

#### Example

If you want to resize your image and convert it to JPG format, you just need to add `?w=800&h=600&fm=jpg` at the end of the URL. The `.url()` method makes it easy to generate these kind of URLs, by simply passing an hash of transformations as argument:

```javascript
// dato.config.js

module.exports = (dato, root, i18n) => {
  dato.blogPosts[0].coverImage.url({ w: 800, h: 600, fm: 'jpg' });
  // => "https://www.datocms-assets.com/123/12345-heart.png?w=800&h=600&fm=jpg"
};
```

Take a look at [Imgix's Image API Reference](https://docs.imgix.com/apis/url) page to see all the transformations available. Some trasformation names contain a dash (ie. [`border-radius`](https://docs.imgix.com/apis/url/border-and-padding/border-radius)), in this case this is the right syntax to use:

```javascript
dato.blogPosts[0].coverImage.url({ "border-radius": 10 });
```
