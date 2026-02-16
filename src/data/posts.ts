import type { Post } from "../types";

export const posts: Post[] = [
  {
    slug: "redds-statuten",
    title: "Redds Statuten",
    date: "February 16, 2026",
    description: "Context and notes around the statutes document, with the full PDF attached.",
    readTime: "4 min read",
    resourceLabel: "Open full statutes (PDF)",
    resourceUrl: "Redds%20Statuten.pdf",
    content: [
      "This is the first archive-backed post on The Redds.",
      "Instead of publishing only a file link, this entry adds context for why the statutes matter and how they should be read.",
      "A full, direct PDF is attached below. Later, this post can be expanded with section-by-section commentary and updates."
    ]
  },
  {
    slug: "second-post",
    title: "On Keeping Things Simple",
    date: "February 12, 2026",
    description: "Why minimal structure and readable typography matter for long-term publishing.",
    readTime: "4 min read",
    content: [
      "Most personal websites become hard to maintain because they start with too much complexity.",
      "For The Redds, the rule is straightforward: static pages, local content, predictable layout.",
      "This keeps the project easy to edit and deploy while still feeling polished."
    ]
  },
  {
    slug: "third-post",
    title: "Archive Kickoff",
    date: "February 8, 2026",
    description: "A first step toward collecting important documents and references.",
    readTime: "2 min read",
    content: [
      "The archive section will collect important materials in one place.",
      "The initial entry is the Redds statutes PDF, with more records to follow.",
      "A stable archive matters as much as new articles when building a lasting website."
    ]
  }
];

export const postBySlug = new Map(posts.map((post) => [post.slug, post]));
