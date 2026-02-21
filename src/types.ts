export type Post = {
  slug: string;
  title: string;
  publishedOn: string;
  description?: string;
  readTime?: string;
  resourceLabel?: string;
  resourceUrl?: string;
  content: string[];
};
