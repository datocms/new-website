---
title: Getting started
---

If you are new to the world of static site generators, NodeJS, React or GraphQL we highly recommend the excellent [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-zero/) that introduces all the tools and concepts that you'll need.

Once you are all comfortable with Gatsby you can add our source plugin.


### Source plugin

DatoCMS offers an official [source plugin](https://github.com/datocms/gatsby-source-datocms) to interact with Gatsby.

Inside your Gatsby project, you can install the `gatsby-source-datocms` package by running this command:

```bash
$ npm install --save gatsby-source-datocms
```

Add the plugin in you `gatsby-config.js` file, specifying the API token of your administrative area:

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-datocms`,
    options: {
      apiToken: `YOUR_READONLY_API_TOKEN`,
      preview: false,
      disableLiveReload: false,
    },
  },
]
```

You can find your API token in the *Admin area > API tokens* section:

![foo](../../images/api-token.png)


### Pull DatoCMS content into components

[Gatsby uses GraphQL](https://www.gatsbyjs.org/tutorial/part-four/#how-gatsbys-data-layer-uses-graphql-to-pull-data-into-components) to let components declare the data it needs and then gives this data to components. Suppose your DatoCMS administrative area has a
[single-instance model](/docs/content-modelling/single-instance) called *About page* (with an `about_page` API identifier).

In your Gatsby project you can create an `About` React component in `src/pages/about.js`, and pull data from DatoCMS like this:

```js
import React from 'react';

export default const About = ({ data }) => (
  <article className="sheet">
    <h1>{data.datoCmsAboutPage.title}</h1>
    <p>{data.datoCmsAboutPage.subtitle}</p>
    <img src={data.datoCmsAboutPage.photo.url} />
    <div dangerouslySetInnerHTML={{ __html: data.datoCmsAboutPage.bio }} />
  </article>
);

export const query = graphql`
  query AboutQuery {
    datoCmsAboutPage {
      title
      subtitle
      photo { url }
      bio
    }
  }
`;
```

Obviously, that's just a simple example: you can learn all the details about how to access your records in the [plugin README](https://github.com/datocms/gatsby-source-datocms).


### Example project

We have also prepared for you an [example project](https://github.com/datocms/gatsby-portfolio/) that you can [see live here](https://cranky-edison-12166d.netlify.com/).

If you want to try it out yourself, please [sign up for a free account](https://dashboard.datocms.com/signup) and click on the following button:

<a class= "DocPage__img-link" href="https://dashboard.datocms.com/projects/new-from-template/static-website/gatsby-portfolio">
  <img src="https://dashboard.datocms.com/deploy/button.svg" title="Deploy with DatoCMS" />
</a>