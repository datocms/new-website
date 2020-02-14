---
title: Localization
---

Middleman [fully supports localization](https://middlemanapp.com/advanced/localization/), and our `middleman-dato` plugin is 100% integrated with its conventions.


First of all, in your `config.rb` file you need to activate the `:i18` plugin,
passing the array of languages you intend to offer to your visitors (most likely,
they will be the same you configured in your DatoCMS administrative area):

```
# config.rb

activate :dato, token: 'YOUR_READ_ONLY_TOKEN'
activate :i18n, langs: [:en, :it]
```

The important thing to understand is that, when you have some localized fields in one of your models, DatoCMS records will return the value of the field for the current `I18n.locale`:

```ruby
I18n.with_locale(:en) do
  dato.blog_posts.first.title # => "Hello world!"
end

I18n.with_locale(:it) do
  dato.blog_posts.first.title # => "Ciao mondo!"
end
```

To generate multi-language pages with Middleman and DatoCMS, you have multiple choices.

### Create a localizable template

Templates that live within the `source/localizable` directory will output one page per locale, and will have the `I18n.locale` already setup for you. 

As an example, suppose we have a [single-instance](/docs/content-modelling/single-instance) model called `home_page`, with two localized single-line string fields: `title` and `catch_phrase`. We can create a multi-language homepage with the following template:

```html
<!-- source/localizable/index.html.erb -->

<h1><%= dato.homepage.title %></h1>
<p><%= dato.homepage.catch_phrase %></p>
```

This will output two pages:

* `/index.html` with the english content;
* `/it/index.html` with the italian content.

### Create multi-language pages with proxies

If you have a DatoCMS collection (ie. *Articles*) and you need to generate a multi-language detail page for each of its records, then you can use proxies:

```
# config.rb

activate :dato, token: 'YOUR_READ_ONLY_TOKEN'
activate :i18n, langs: [:en, :it]

dato.tap do |dato|
  # iterate over all the administrative area languages
  dato.available_locales.each do |locale|

    # switch to the nth locale
    I18n.with_locale(locale) do

      # iterate over the "Article" records...
      dato.articles.each do |article|

        # ...and create a proxy file for each article
        proxy(
          "/#{locale}/articles/#{article.slug}/index.html",
          "/templates/article.html",
          locals: { article: article },
          locale: locale
        )
      end
    end
  end
end

ignore "templates/article.html.erb"
```

The `source/templates/article.html.erb` template will be something along these lines:

```
# source/templates/article.html.erb

<h1><%= article.title %></h1>
<div><%= article.content %></div>
```
