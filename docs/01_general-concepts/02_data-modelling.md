---
title: Building the content schema
---

DatoCMS can be seen as a editor-friendly interface over a database, so the first step is to build the actual schema upon which users will generate the actual website content.

#### Models

The way you define the kind of content you can edit inside each different administrative area passes through the concept of <strong>models</strong>, which are much like database tables.

Each administrative area can specify a number of different models, and they represent <em>blueprints</em> upon which users will store the website content.

For example, a website project can define different models for articles, products, categories, and so on.

#### Fields

Each model consists of a set of <strong>fields</strong> that you define (strings, numbers, uploads, videos, relationships between objects). Each field has a name and additional metadata, like validations, or particular configurations to better present the field to the editor.

Fields in DatoCMS can also be localized, if you need to accept different values based on language.

#### Records

DatoCMS stores the individual pieces of content you create from a model as <strong>records</strong>, which are much like table rows in a database.

