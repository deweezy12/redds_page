import type { Post } from "../../types";

type PostModule = { default: Post };

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  day: "numeric",
  year: "numeric"
});

const postModules = import.meta.glob<PostModule>("./*.post.ts", {
  eager: true
}) as Record<string, PostModule>;

export const posts = Object.values(postModules)
  .map((module) => module.default)
  .sort((a, b) => Date.parse(b.publishedOn) - Date.parse(a.publishedOn));

export const postBySlug = new Map(posts.map((post) => [post.slug, post]));

export function getPostMeta(post: Pick<Post, "publishedOn" | "readTime">) {
  const publishedDate = dateFormatter.format(new Date(post.publishedOn));
  return post.readTime ? `${publishedDate} | ${post.readTime}` : publishedDate;
}
