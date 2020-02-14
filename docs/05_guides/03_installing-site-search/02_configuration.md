---
title: Configuration
---

First thing first, go to the *Settings > Deployment settings* section of your administrative area and select the environment where you want to integrate Site Search with (ie. *Production*):

![foo](../../images/search/env.png)

Specify your *Website frontend URL*. That's the address from which crawling will begin:

![foo](../../images/search/frontend.png)

Don't forget to also enable *Site search*:

![foo](../../images/search/switch.png)

To start the first indexing of content, press the *Publish changes* button:

![foo](../../images/search/publish.png)

If you go to the *Settings > Deployment logs*, you will see that after the website gets published, DatoCMS will start spidering your website:

![foo](../../images/search/progress.png)

When spidering ends (it may take a while, depending on the size of your website), you'll see a *Site spidering completed with success* event in your log:

![foo](../../images/search/completed.png)

Clicking on the *Show details* link will present you the complete list of spidered pages:

![foo](../../images/search/stats.png)

