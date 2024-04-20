##### Preference for Italian applications! 🇮🇹

At the moment, our entire development team is based in Italy. Therefore, **we are giving preference to applicants from Italy** as it makes our work process easier. Nonetheless, we will also consider highly qualified applicants from other locations: we already have employees abroad, and our internal communications are already all in English. No matter the location, there needs to be a minimum of 5 hours of overlapping work time between 8:00 GMT+2 and 18:00 GMT+2.

## The product

DatoCMS is the **headless CMS that gets out of the way**, so you can bring projects to life quickly and without unnecessary complexity.

Its powerful Content GraphQL API and no-code approach to content structuring enables teams to focus on execution rather than configuration. Developers can create powerful, reusable components for scalable and secure content creation, while authors and editors effortlessly build and publish content to multiple sites, apps, and localizations, all without needing developer intervention.

You can find all the info you need (and more) on this very website.

## The company

DatoCMS started in 2015 inside a small Italian web agency. It grew organically, **with no marketing**. By 2019, it had become a fully self-funded, profitable company with a committed team that is solely focused on the development and upkeep of one top-notch product.

At present, it has **thousands of paid customers in more than 70 countries**, with the highest concentration in North America and Northern Europe. Our [Partner Program](https://www.datocms.com/partners) features over 100 top-notch web agencies and studios distributed in more than 45 countries.

Our product is used by a [diverse range of companies and organizations](https://www.datocms.com/customers), from small startups to **Fortune 500 enterprises**, across various sectors such as e-commerce, publishing, and media.

The monthly churn rate is slightly less than 1% — people stick to us because the product, documentation and support is great. Each year, we see an increase in growth between 20-30%, and in 2023, our yearly recurring revenue reached 4.5 million USD. The overwhelming majority our customer conversions happen through our self-service option, without the need for any sales team involvement.

Not too shabby for a **fully-remote [team of 12](https://www.datocms.com/company/about)**.

We're a **[radically transparent company](https://www.datocms.com/blog/a-look-back-at-2023)**, with a strict <mark>no-bullshit approach</mark>. We strive to keep bureaucracy to the bare minimum, focusing on a few aspects at a time. We're committed to staying **[small and nimble](https://www.datocms.com/blog/how-can-you-be-eight-people)**, because we believe it's the sweet spot that benefits both us and our customers.

We have zero interest in selling off our company, we're not in the business of courting venture capital, and the idea of going public is off the table.

## What the codebase you'll be working on is like

We may be biased, but **DatoCMS is a great piece of software**.

##### The core

The heart of the system is a **Rails monolith**, dedicated exclusively to serving API requests. It's connected to several sharded Postgres databases, Redis, and Elasticsearch.

* The [Content Delivery API](https://www.datocms.com/docs) is a **read-only GraphQL API**, heavily cached at the CDN level. It's built to handle the constant storm of real-time requests from our client's websites.
* The [Content Management API](https://www.datocms.com/docs/content-management-api) allows to edit the content inside a DatoCMS project. It's a **REST powerhouse with over 40 entities**, amounting to more than 150 endpoints. Everything that can be done from the interface, can also be done via API.
* The [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api) supports the same GraphQL queries you'd encounter in the Content Delivery API, but it serves up a **Server-Sent Events streaming channel**. It is developed in **Elixir**, and is designed to manage hundreds of thousands of simultaneous open connections, all waiting for content updates.
* The **Dashboard API** handles user registration, billing, and the creation of new projects.
* The **Image API** and **Video API** serve the assets contained in each project from a CDN, offer every possible type of built-in optimization and can manage complex transformations on the original asset.

##### The main frontends

Two other crucial parts of the product are the **SPA applications** used by both editors and customers to manage their projects and content. These are known as *CMS* and *Dashboard*.

They are **advanced TypeScript/React projects**, equipped with an **elaborate and smart Redux state management system** capable of managing collaborative edits with real-time updates.

The content editing feature of CMS, specifically, is finely tuned to efficiently manage documents composed of thousands of fields.

CMS also has the task of managing and orchestrating the [third-party plugins](https://www.datocms.com/docs/plugin-sdk) that can be installed in any project, and that work with the CMS itself to customize the overall interface/behavior.

##### Open-source projects

We also manage and maintain a variety of open-source TypeScript projects that are **utilized daily by hundreds of third-party developers**:

* The **[CLI](https://github.com/datocms/cli)** and **[TypeScript API clients](https://github.com/datocms/js-rest-api-clients/)**.
* The packages for **[React](https://github.com/datocms/react-datocms)/[Vue](https://github.com/datocms/vue-datocms)/[Svelte](https://github.com/datocms/datocms-svelte)** make it easy and quick to integrate with DatoCMS, allowing you to immediately utilize all its capabilities.
* The [SDK for **building and releasing plugins**](https://github.com/datocms/plugins-sdk/), accompanied by a library of React components to mimic Dato's native interface.
* A ton of **[official plugins](https://www.datocms.com/marketplace/plugins)** and **[demo projects](https://www.datocms.com/marketplace/starters)** written for every conceivable frontend technology.

##### Everything else

When discussing the galaxy of projects orbiting the core, we're dealing with:

* Code executed directly on the edge (Cloudflare, Fastly) responsible for handling various aspects before the requests even reach the central Rails application.
* Our [marketing website](https://www.datocms.com/) and [Community forum](https://community.datocms.com/).
* A variety of smaller frontends/tools that assist the Support and Sales team in their daily activities.

## The development team you'll join

Take another look at the previous chapter, bearing in mind that <mark>**our development crew is a team of 4**</mark> (with one part-timer), and note the following:

* DatoCMS APIs are being heavily utilized. To put things into perspective, we're dealing with over **[5 billion API requests every month](https://www.datocms.com/blog/a-look-back-at-2023#infrastructure-api-and-video-traffic-soar)**, which translates to more than 15TB of traffic.
* The **average response time** for our Content Delivery API is a swift 43ms and our uptime exceeds the [**99.99x%** threshold](https://status.datocms.com/).
* On average, every year we release **5-6 major new features** and [+50 smaller features and improvements](https://www.datocms.com/product-updates).

How do we pull this off?

* **Our codebase is well-structured**, thoroughly tested, and consistently maintained.
* We **aim to delegate** infrastructure-related tasks to third parties (i.e., Heroku, managed databases, etc.).
* The level of experience and skill within the team is **exceptionally high**.
* Our **fully remote and asynchronous work** style minimizes time wasted on unnecessary things.
* Each developer is a **full-stack wizard** with a keen sense for UX, eliminating much of the back-and-forth typically seen in development teams.
* We prefer to tackle a **series of small, straightforward tasks** rather than embarking on massive, unclear projects.
* We strongly believe in **keeping things simple**.

## What we are looking for

We're not in a hurry to hire someone as everything is going smoothly, but bringing an additional developer on board would enable us to tackle more tasks concurrently than we can manage at present.

**We are looking for an exceptional individual who can derive pleasure from working on very challenging, yet immensely rewarding project like this.**

They should possess a broad understanding of all facets of web programming, and should already have had the chance to work in a **large and complex codebase**, capable of keeping track of finer details, identifying existing operational patterns, **interpreting the underlying intention of the code**, and perhaps recognizing what might be lacking.


Given high-level specifications, and a timeboxed period to work on it — we work with [Shape Up methodology](https://basecamp.com/shapeup) which operates in 6-week cycles — they must be able to make **the right choices to get to the end**, knowing when to **raise their hand** and ask for help when they recognize that they do not have all the information they need to decide what the best course of action is.

Here are some examples of pitches that individual developers from our team have recently tackled and published in less than 6 weeks (including documentation and handover of the project to marketing):

<div id="pitches">
  <a href="/images/pitches/2.png" target="_blank"><img src="/images/pitches/2.png" /></a>
  <a href="/images/pitches/3.png" target="_blank"><img src="/images/pitches/3.png" /></a>
  <a href="/images/pitches/4.png" target="_blank"><img src="/images/pitches/4.png" /></a>
  <a href="/images/pitches/5.png" target="_blank"><img src="/images/pitches/5.png" /></a>
  <a href="/images/pitches/6.png" target="_blank"><img src="/images/pitches/6.png" /></a>
  <a href="/images/pitches/7.png" target="_blank"><img src="/images/pitches/7.png" /></a>
</div>

<style>
  #pitches {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    align-items: center;

    a {
      container-type: inline-size;
    }

    img {
      width: 100%;
      object-fit: cover;
      object-position: top center;
      aspect-ratio: 1.2 / 1;

      @container (max-width: 250px) {
        aspect-ratio: 1 / 1;
      }

      @container (max-width: 230px) {
        aspect-ratio: 1 / 2;
      }
    }
  }

</style>

## About you

* You **love the craft** and getting better at it.
* **You get a lot done, independently.** You can keep track of and lead multiple projects at once.
* You aren’t above **mundane tasks**.
* You have strong English writing and speaking skills, and **enjoy internal communication based on long-form writing**, rather than a verbal tradition of meetings, speaking, and chatting.
* You know **poor communication creates more work**, and that few things are as important to study, practice, and perfect as clear communication.
* You have a **team-first mentality**. You’re open to ideas from others, and work collaboratively when called for.
* You can take a stand, yet commit even when you disagree.

You also have demonstrated past experience in the following domains:

* Traditional **theoretical programming paradigms**
* **Proficiency in Ruby/Rails and JavaScript/TypeScript/Redux/React**
* Sustainable **testing methodologies**
* **SQL and Postgres** (with an eye towards performance optimization)
* Release of **open-source NPM packages**
* Best practices for **public API design**
* Knowledge of **security-related issues**
* Modern **HTML/CSS**

*Yes, a developer at Dato is <mark>capable of handling all this</mark>. We may not be a 100% expert in everything, but we've been around the block with all of this before we even walked through the door.*

## Compensation

Your compensation will be determined by your geographical location and your level of experience, but **we start at 80K EUR, in addition to the consistent bonus derived from [profit sharing](https://www.datocms.com/company/profit-sharing)**.

Regardless, if you're a good match for us, rest assured, we will make sure that the **financial aspect won't be a problem.**

## Unique benefits of DatoCMS

* You’ll work on a product that’s a leader in its niche, and **[very much loved](https://www.datocms.com/wall)**.
* We’re deliberately **[a humble small company](https://www.datocms.com/blog/how-can-you-be-eight-people)**, so you will have a huge impact.
* You won't find a better **life/work balance** anywhere else. No emails or messages intruding on your personal time, and no deadlines, absolutely no overtime.
* We have a lot to do, but no big rush to do it. We make our impact **one small step at a time**.
* We’re **independent, profitable and committed to longevity**. This isn’t a VC-backed or publicly traded company pursuing growth at all costs.
* Consistent [bonus pay based on **profit sharing**](https://www.datocms.com/company/profit-sharing), not stock market performance. Nobody here is waiting to cash out.

## Hiring process

We rarely hire. Maybe only once or twice a year. We expect it will take a while to find the right candidate, so **we have no deadline for closing this application**.

We will read your application, discuss it, and **give you a response within 3 weeks** (likely less). If we think you might be a good fit for this role, we will ask you to meet us for a video chat to get to know each other better, and discuss next steps.

Here are some of the basics elements of our hiring process you should expect:

* We give first consideration to individuals in the desired location.
* While we never rush, we respect your time, and try to make the process as efficient as possible.
* It is our goal to keep you informed of the status of your application. We may not always be able to do this right away, but we’ll let you know one way or the other.
* We hope that anyone willing to submit a job application has at least fully read the offer. If you are one of these people, conclude the last question of the application by inserting an emoji.
* We value diversity on our team, so our decisions will be based on a variety of factors:
  * Quality and content of the application.
  * Previous work experience.
  * Written responses to follow up questions.
  * One or more video interviews with members of our team.
  * One or two short projects.
  * References.

In some cases, we may include a small paid contract project before making a hiring decision.

## That should be it! 😀

Thanks for reading. We hope we've been clear and transparent, and have given you a glimpse into what it means to work as a developer at DatoCMS. We look forward to hearing from you! ✌️