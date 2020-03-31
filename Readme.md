

## Running local

`jekyll serve`

## Publushing changes

Any commit made into master will be automatically published to [the site](https://rafaelroman.com)

## Composing new page

There is an admin dashboard that can be used based on `jekyll-manager`, just run it locally and point to [the admin](http://localhost:4000/admin)

The following commands can be used (from jekyll-compose)
```
  draft      # Creates a new draft post with the given NAME
  post       # Creates a new post with the given NAME
  publish    # Moves a draft into the _posts directory and sets the date
  unpublish  # Moves a post back into the _drafts directory
  page       # Creates a new page with the given NAME
  rename     # Moves a draft to a given NAME and sets the title
  compose    # Creates a new file with the given NAME
```

