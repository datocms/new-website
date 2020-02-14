---
title: Localization
---

**Note** Just as explained in the [product overview](/docs/), DatoCMS is totally agnostic in terms of static site generators: it just allows you to dump content locally, and the rest is up to you. There are several ways to handle multiple languages with Jekyll — just as an example, take a look at [this guide](https://www.sylvaindurand.org/making-jekyll-multilingual/), or [this plugin](https://github.com/vwochnik/jekyll-language-plugin).

Within your `dato.config.rb` file, you can easily switch between your locales like this:

```ruby
# dato.config.rb

I18n.locale = :en
dato.blog_posts.first.title   # => "Hello world!"

I18n.locale = :it
dato.blog_posts.first.title   # => "Ciao mondo!"
```

If you need to temporarily switch locale, and then restore the previous value, you can use `I18n.with_locale`:

```ruby
# dato.config.rb

I18n.locale = :en
dato.blog_posts.first.title     # => "Hello world!"

I18n.with_locale('it') do
  I18n.locale                   # => :it
  dato.blog_posts.first.title   # => "Ciao mondo!"
end

I18n.locale                     # => :en
dato.blog_posts.first.title     # => "Hello world!"
```


You can also obtain the list of languages of your administrative area with `I18n.available_locales`:

```ruby
# dato.config.rb

I18n.available_locales  # => [ :en, :it ]
```

Here's an complete example that creates multiple versions of your articles, one for each available locale:

```ruby
# dato.config.rb

# inside the "_posts" directory
directory "_posts" do

  # iterate over all the administrative area languages
  I18n.available_locales.each do |locale|

    # switch to the nth locale
    I18n.with_locale(locale) do

    # iterate over the "Blog post" records...
      dato.blog_posts.each do |article|

        # ...and create a localized markdown file for each article!
        create_post "#{locale}-#{article.slug}.md" do
          frontmatter(
            :yaml,
            title: article.title,
            language: locale,
          )

          content(article.content)
        end
      end
    end
  end
end
```
