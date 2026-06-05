# Personal Site

Vite + React + React Router + Tailwind CSS + MDX.

## Development

```bash
npm install
npm run dev
```

## Adding a blog post

1. Create a new `.mdx` file in `src/posts/`:

   ```
   src/posts/my-new-post.mdx
   ```

2. Add frontmatter at the top:

   ```mdx
   ---
   title: My New Post
   date: 2026-06-15
   description: A short summary shown on the blog index.
   ---

   Your content here...
   ```

3. The filename (without `.mdx`) becomes the URL slug.
   `my-new-post.mdx` → `/blog/my-new-post`

4. Posts are sorted by `date` descending on the blog index. No additional wiring needed.

## Deploying

### Netlify

1. Push to a GitHub/GitLab repo.
2. Connect the repo in the Netlify dashboard.
3. Build settings are already in `netlify.toml` — no manual config needed.
4. Add your custom domain under **Site settings → Domain management**.

### Cloudflare Pages

1. Push to a GitHub/GitLab repo.
2. In the Cloudflare dashboard: **Pages → Create a project → Connect to Git**.
3. Set build command: `npm run build` and output directory: `dist`.
4. `public/_redirects` handles SPA routing automatically.
5. Add your custom domain under **Custom domains** in the Pages project.

## Project structure

```
src/
  components/
    Layout.jsx      # page wrapper with nav
    Nav.jsx         # top navigation bar
  lib/
    posts.js        # loads and sorts all MDX posts
  pages/
    Home.jsx
    Blog.jsx
    BlogPost.jsx
    Projects.jsx
    About.jsx
  posts/
    hello-world.mdx # sample post — replace or delete
  App.jsx           # route definitions
  main.jsx          # entry point
  index.css         # Tailwind imports
```
