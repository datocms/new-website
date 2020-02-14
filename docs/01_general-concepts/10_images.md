---
title: Working with images
---

Every image/file you upload in DatoCMS is stored on [Imgix](https://www.imgix.com/), a super-fast CDN optimized for image delivery, which provides on-the-fly image manipulations and caching.

What that means is that by adding some parameters to your image URL, you can enhance, resize and crop images, compress them and change format for better performance, create complex compositions, and extract useful metadata.

For example you can crop, resize, change quality or format and many other manipulations, while fetching the pictures.

Here's an example of an image uploaded to DatoCMS:

`https://www.datocms-assets.com/205/1570542926-example.jpg`

![Reference image](https://www.datocms-assets.com/205/1570542926-example.jpg)

And if we add these parameters to the URL:

```
https://www.datocms-assets.com/205/1570542926-example.jpg?
  fit=facearea&
  faceindex=1&
  facepad=5&
  sat=-100&
  mask=ellipse&
  w=300&
  h=300&
  bg=F00&
  fm=png&
  txt=%C2%A9%20Matheus%20Ferrero&
  txt-align=bottom,center&
  txt-color=FFF&
  txt-size=15&
  txt-pad=40
```

we get this image back:

![Manipulated image](https://www.datocms-assets.com/205/1570542177-matheus-ferrero-lialq2siquk-unsplash.jpg?fit=facearea&faceindex=1&facepad=5&sat=-100&mask=ellipse&w=500&h=500&bg=F00&fm=jpg&txt=%C2%A9%20Matheus%20Ferrero&txt-align=bottom,center&txt-color=FFF&txt-size=18&txt-pad=40)

The first time the image is called with these parameters, Imgix will cache the resulting image on one of their geographically positioned CDN servers; subsequent calls with the same parameters will not need to reprocess the image. Imgix will then propagate the image to all other CDN servers around the world, as shown on the following map:

![Imgix CDN](https://assets.imgix.net/cdnmap/cdn_map_transparent_june2019.ai?fm=png8&w=1260&h=640&fit=crop&dpr=2&cs=strip)

Take a look at [Imgix's Image API Reference](https://docs.imgix.com/apis/url) page to see all the transformations available.
