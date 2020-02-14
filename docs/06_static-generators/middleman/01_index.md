---
title: Integrating with Middleman
---

DatoCMS offers Middleman plugin that makes it extremely convenient to use content stored in your administrative area inside your website views.

**Disclaimer** This guide assumes you already know what Middleman is and how it works. If you need some help getting started with Middleman, you can read the official [Middleman documentation](https://middlemanapp.com/basics/install/).

### Installing the plugin

Inside your Middleman project, you can install the `middleman-dato` gem tool running these commands:

```bash
$ echo 'gem "middleman-dato"' >> Gemfile
$ bundle install
```

Once installed, you can activate the plugin in your `config.rb`:

```ruby
activate :dato, live_reload: true

# enable livereload on development
configure :development do
  activate :livereload
end
```

The plugin reads your DatoCMS API token from a `.env` file (just make sure not to publish it on Github):

```bash
$ echo '.env' >> .gitignore
$ echo 'DATO_API_TOKEN=abc123' >> .env
$ bundle exec middleman server
```

You can find your API token in the *Admin area > API tokens* section:

![foo](../../images/api-token.png)

---

#### Published vs latest versions

If you are working on development/staging environment, you might want to preview the latest version of records instead of the published one. In this case, you can activate the `preview` flag:

```ruby
activate :dato, preview: true
```

---

### Accessing DatoCMS content

Once the plugin is activated, an object called `dato` will be available in your Middleman views to access content coming from your administrative area:

```html
<!-- source/index.html.erb -->

<h1><%= dato.homepage.title %></h1>
```

The same object is also available in your config file. To create multiple pages starting from a collection of DatoCMS records, you can use Middleman [proxy pages](https://middlemanapp.com/advanced/dynamic_pages/):

```ruby
# config.rb

# activate middleman-dato plugin
activate :dato, live_reload: true

configure :development do
  activate :livereload
end

# due to how middleman 4 collections work (http://bit.ly/2jHZTI9), 
# always use `dato` inside a `.tap` method block, like this:
dato.tap do |dato|

  # iterate over the "Blog post" records...
  dato.blog_posts.each do |article|

    # ...and create a page for each article starting from a template!
    proxy "/articles/#{article.slug}.html", "/templates/article.html", locals: { article: article }

  end
end

# tell Middleman to ignore the template
ignore "/templates/article.html.erb"
```

```html
<!-- source/templates/article.html.erb -->

<h1><%= article.title %></h1>

<ul>
  <% article.categories.each do |category| %>
    <li><%= category.name %></li>
  <% end %>
<ul>

<div>
  <%= article.content %>
</div>
```

Run `bundle exec middleman server` and enjoy!

Obviously, that's just a quick tour: you can learn all the details about how to access your records inside your views and config file in the following sections.
