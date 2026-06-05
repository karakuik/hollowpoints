// Eagerly import all MDX posts so frontmatter is available synchronously.
// Each module exports `frontmatter` (via remark-mdx-frontmatter) and a default component.
const modules = import.meta.glob('../posts/*.mdx', { eager: true })

export const posts = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace('../posts/', '').replace('.mdx', ''),
    component: mod.default,
    ...mod.frontmatter,
  }))
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getPost(slug) {
  return posts.find(p => p.slug === slug)
}
