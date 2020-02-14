---
title: Modular content fields
---

Everyone hates WYSIWYG editors: developers know they produce dirty code, designers fear the introduction of unwanted styling, editors struggle to use them. Sure, DatoCMS features a WYSIWYG editor since day one, but we want to keep it simple and lightweight.

In DatoCMS you can achieve structured, rich-content editing using a specific type of field called **Modular content**:

![Choose modular content field type](../images/modular-content/1.png)

The idea is to give your authors the choice to compose their content by alternating certain blocks (ie. text, images, videos, etc.), which are nothing more but "low-level" models. Authors, to compose a structured content, will be able to add and reorder these blocks as they prefer:

![Modular content example](../images/modular-content/0.png)

This gives authors a lot of freedom to organize their content, much like Medium editor does, while keeping the content clean and structured.

---

### How to build a Modular content editor

Suppose we have an *Article* model, and we want to add a modular content field to manage its content. The first step is to decide which are the different kind of basic blocks you want your authors to alternate. In this case, we want our content to be a flexible composition of:

* Text
* Quotes
* Videos
* and Images

To achieve this result, first we create the Article model, and add a Modular content field to it:

![foo](../images/modular-content/2.png)

![foo](../images/modular-content/1.png)
![foo](../images/modular-content/3.png)

Under the Modular content field we just created, we can now add our blocks. There's a *Add new block* button for that, so we'll use it to create the Quote block:

![foo](../images/modular-content/4.png)
![foo](../images/modular-content/5.png)

Blocks are just a composition of fields, just like ordinary models. In our case, we want quotes to be made of two fields: one containing the actual quote, the other containing the author.

You can click on the *Settings* button on the Quote block, to edit its fields:

![foo](../images/modular-content/6.png)
![foo](../images/modular-content/7.png)
![foo](../images/modular-content/8.png)


