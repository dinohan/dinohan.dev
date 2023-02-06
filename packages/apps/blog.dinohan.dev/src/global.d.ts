declare const __PATH_PREFIX__: string

interface Social {
  twitter: string
}
interface Author {
  name: string
  summary: string
}

interface SiteSiteMetadata {
  author: Author
  siteUrl: string
  social: Social
}

interface Frontmatter {
  title: string
  description: string
  date: string
}

interface Fields {
  slug: string
}

interface MarkdownRemark {
  excerpt: string
  html: string
  frontmatter: Frontmatter
  fields: Fields
}
