import type { Post } from "../../types";

export default {
  slug: "example",
  title: "Beispiel",
  publishedOn: "2026-02-15",
  description: "Hallo Welt",
  readTime: "1 Min. Lesezeit",
  content: ["Hallo Welt"]
} satisfies Post;
