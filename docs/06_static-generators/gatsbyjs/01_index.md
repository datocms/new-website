---
title: Build a site with GatsbyJS and DatoCMS
---

Let's dive into what it means to build a website with GatsbyJS and DatoCMS :swimmer:

**tl;dr** :bullettrain_side: if you are in a rush and you know already how things work, jump to [getting started with Gatsby](#getting-started-with-gatsby).

Otherwise you can keep reading to get some context to better understand how things work.

---

If you've built a website before with a traditional CMS you expect everything in one place, all nice and simple. But if you are here you may have experienced some of the drawbacks of that model and you want to know if an alternative exists.

This guide is meant as a gentle introduction on building websites using a new paradigm, the [JAMStack](https://jamstack.org/).

JAM stands for JavaScript, APIs and Markup. This is just a funny acronym to explain a simple concept: your website is composed only of static HTML pages with JavaScript on top that interacts with external APIs.


### Why building a JAMStack site?

A JAMStack site comes with some obvious advantages:

* **better performance**. It's composed exclusively of static files that can be served over a globally-distributed CDN
* **lower cost, easier scaling**. Since the files are on a CDN, scalability is a problem solved by design. Regarding cost, there are many free or very low cost alternative nowadays for this task
* **improved security, zero maintenance**. No server generated pages, means reduced attack surface. APIs are normally small and well defined, often managed by third parties reducing even more the amount of maintenance needed
* **better development workflow**. Because developers are other fellow humans we firmly believe that a sane development workflow is important. Clear separation of responsibilities, loose coupling, reproducible builds are core concepts that let developers be more productive, less stressed and work better in small and focused teams.

Before diving into how we can fit a fully-fledged CMS into the JAMStack scenario we need to introduce all the moving parts involved in the stack.


### Moving parts

DatoCMS is only one of the components needed to get your website to your users. Let's explore them one by one.

1. As you might guess, DatoCMS is where all the content is stored and where the editor will go to add more or change the existing. This is the **headless CMS**. It's *headless* because you can provide your own head, in the next step.

1. It's time to talk about the *head* of your site. The tool that you need to pull the data out of DatoCMS and present it to your users. In this case we are going to use [GatsbyJS](https://www.gatsbyjs.org/), a **site generator**, as we want to make a website. But you could use the same data in other contexts, such as a smartphone app for example.

1. This is all good, but how do you get your website with your content to your users? You need to "build" the website by pulling all the information out of DatoCMS and creating an HTML version of your site with the content embedded. This build step is responsibility of your **build system**.

1. Once you have a "build" object you can ship it to your **hosting service** that will simply deliver the HTML pages to your users. This will be normally an object storage with a CDN on top.

Now that we have briefly discussed all the concepts involved in the JAMStack we can move over to see how they relate to each other.


### How things interact

The best place to start is the site generator. Its purpose is to process static content, e.g. Markdown pages and images, and to compose all the HTML views with links between them. 

It's the developer job to write the HTML/CSS layouts once, then the site generator populates them automatically from the input content.

What we aim to do is to **replace the static content with our headless CMS**.

To make this step easier, DatoCMS provides plugins to integrate with many site generators so that you can pull data from DatoCMS as if it was static content.

What happens in reality is that every time that something changes in the CMS a build will be triggered, either manually or automatically, fetching data from an API and generating the resulting HTML/CSS/JS pages.

With this approach you could mix different sources, static content in the HTML, dynamic content from the CMS and even more, by composing calls to external APIs at run time in the user's browser.

Both the developer making the site and the build system at deploy time will trigger a build from the site generator. The resulting object will be used by the developer to test and improve or by the hosting service to serve the end users.

With all this context is now time to build something!
