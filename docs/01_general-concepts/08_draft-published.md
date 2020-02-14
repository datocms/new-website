---
title: Draft/published system
---

You can decide to activate the draft/published system on a per-model basis:

![Activating draft/published system](../images/versioning/activate.png)

If you do so:

* When you create a new record, it will be put into a *Draft* status. This means that the record is still not published: you can continue making changes and saving the record without having to worry about showing unfinished content to your end users.

* Once you're satisfied with the changes, you can click on the *Publish* button: the latest revision of your record will be marked as the *Published version*, and it will be instantly available in the DatoCMS API.

  On the Content Management API the calls by default fetch published record, you can get also the records in draft by specifying the version argument. More details on this [documentation page](https://www.datocms.com/docs/content-management-api/resources/item#instances).

  The Content Delivery API instead has two different endpoints, one for published records and one for the latest version. Again more details on this [documentation page](https://www.datocms.com/docs/content-delivery-api/endpoint).

* If you make a change to a published record, its status will be become **Updated**. Again, those changes won't be visible to end users and published until you explicitly click on the *Publish* button again.

![Draft, published, updated diagram](../images/versioning/diagram.png)
