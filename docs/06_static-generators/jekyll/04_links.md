---
title: Link fields
---

Suppose our `blog_post` model has the following fields:

* `author`: *Single link* referencing a `user` record;
* `related_posts`: *Multiple links* referencing other `blog_post` records;

In this case, `blog_post.author` will return the linked `user` record (or `nil`, if the relation is empty), and `blog_post.related` will return an array of `blog_post` records. 

```ruby
blog_post.author.full_name   # => "Mark Smith"

blog_post.related.each do |related_post|
  related_post.title         # => "Another post!"
end
```

Use method chains to navigate deep across your records' relationships:

```
blog_post.related.first.author.name       # => "Tom Kepler"
```

#### Reverse lookups

You can easily find all the blog post for a specific author with this Ruby one-liner:

```ruby
peter = dato.find("1413")
dato.blog_posts.select { |blog_post| blog_post.author == peter }
```
