---
name: new-post
description: Create a new blog post with proper frontmatter
argument-hint: "[post-title]"
disable-model-invocation: true
---

# Create New Blog Post

Create a new blog post in `src/posts/` directory.

## Steps

1. Create a new directory: `src/posts/$ARGUMENTS/`
2. Create an MDX file with the following frontmatter:

```mdx
---
title: $ARGUMENTS
date: [today's date in YYYY-MM-DD format]
category: [ask user for category]
thumbnail:
---

[Post content here]
```

3. Ask the user what category this post belongs to
4. Ask the user for the initial content or topic
