import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { postBySlug } from "../data/posts";

export function PostPage() {
  const { slug } = useParams();
  const post = slug ? postBySlug.get(slug) : undefined;

  if (!post) {
    return (
      <>
        <SiteHeader compact />
        <main className="main-shell main-shell--article">
          <article className="article">
            <h2>Post not found</h2>
            <p>The requested post does not exist.</p>
            <p>
              <Link to="/">Back to home</Link>
            </p>
          </article>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader compact />
      <main className="main-shell main-shell--article">
        <article className="article">
          <h2 className="article__title">{post.title}</h2>
          <p className="article__meta">
            {post.date}
            {post.readTime ? ` | ${post.readTime}` : ""}
          </p>
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {post.resourceUrl ? (
            <p className="article__resource">
              <a href={post.resourceUrl} target="_blank" rel="noreferrer">
                {post.resourceLabel ?? "Open attachment"}
              </a>
            </p>
          ) : null}
          <p>
            <Link to="/">Back to all posts</Link>
          </p>
        </article>
      </main>
    </>
  );
}
