---
title: Next steps
---

You might have started from a demo, or you might have started from scratch, but you have a Gatsby site running linked to DatoCMS.

Now what?


### CMS and frontend mapping

One of the benefits of the JAMStack is the **decoupling of the CMS from the frontend**. It means that you can freely modify or even replace one of the components without the other knowing. But there's a major caveat: the two parts must have a shared understanding how the data is structured. You can call that the *schema* or the *data structure*, it's a description of how the information is organized in the CMS.

This means that if you change your models in DatoCMS you need to reflect that change in the GatsbyJS code. If you are used to the traditional CMS approach, this might sound counterintuitive, but since the components that we [described before](/docs/static-generators/gatsbyjs#moving-parts) are completely independent one from the other you are in charge of this mapping.

To give you a quick example, say that you want to add a subtitle field to an existing blogpost model in DatoCMS. If you simply do that your GatsbyJS site will not know about it, unless you change the GraphQL queries that pull blogposts data and you add that field in your views where you want that information to appear.

So the CMS drives the structure of the content, that then needs to be mapped in the frontend.

The frontend instead drives the layout and that's completely independent from the data modelling.


### Add a deployment environment

Now that you have started to add and modify your existing models you might wonder how you can test changes before going live. If you've started from the demo the first environment has been set up automatically for you.

Anyway, having a couple environments is a quite popular setup and it allows having your production one alongside a staging where you can test things out. You can have a look at this guide: [how to deploy your static website](/docs/general-concepts/deployment) to see how to go ahead in this direction.


### Integrate with other services

Being a true player in the JAMStack ecosystem, DatoCMS is very friendly to external tools that can integrate. The way to do that is via what is normally called a *webhook*. The webhook is simply an HTTP call to an external system that DatoCMS sends based on certain triggers that you can manage.

For example you might want to notify your team in chat when a new content goes live or you want to trigger a scraping of your newly deployed site from a third party search engine, or whatever else you can imagine!

To set up the webhooks or to learn more about what you can do in DatoCMS, you can go ahead with the [Webhook](/docs/general-concepts/webhooks/) guide.


### We are here to help

Are you feeling confused? Do you need a hand for something that is not quite clear in the documentation? We are just one-click away.

Have a look at how you can get help from us in our [support page](/support). We are eager to improve DatoCMS and make it as easy and understandable as possible.

Reach out!