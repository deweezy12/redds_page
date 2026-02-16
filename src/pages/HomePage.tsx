import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { posts } from "../data/posts";

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="main-shell">
        <section className="post-list" aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post.slug} className="post-row">
              <p className="post-row__meta">
                {post.date}
                {post.readTime ? ` | ${post.readTime}` : ""}
              </p>
              <h2 className="post-row__title">
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description ? (
                <p className="post-row__description">{post.description}</p>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
