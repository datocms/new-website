---
title: Accessing records
---

Here's the different methods you can use inside your `dato.config.rb` file to retrieve records stored in your administrative area.

### Find a record by ID

If you already know the ID of the record you need to access, just use the `dato.find` method:

```ruby
# returns the record with ID 3411
dato.find(3411)
```

---

### Find all the records of a specific model

Suppose you have a *Blog post* model in your administrative area, and you want retrieve the complete collection of its records. First thing first, you need to know its *Model ID*:

![foo](../../images/edit-model-dialog.png)
![foo](../../images/edit-model-button.png)

In this case, the ID is `blog_post`, so you can retrieve its records **pluralizing the Model ID**, and using it as a method on the `dato` object:

```ruby
# iterate over the Array of records of the `blog_post` model

dato.blog_posts.each do |record|
  # ...
end
```

If you need to access the record associated to a [single-instance model](/docs/content-modelling/single-instance), you don't need to pluralize the Model ID:

```ruby
# returns the record for the `about_page` single-instance model
# (or nil, if it hasn't been created yet)

dato.about_page
```

