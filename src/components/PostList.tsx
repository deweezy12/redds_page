import { Link } from "react-router-dom";
import { getPostMeta, posts } from "../content/posts";

type PostListProps = {
  ariaLabel: string;
};

export function PostList({ ariaLabel }: PostListProps) {
  return (
    <section className="post-list" aria-label={ariaLabel}>
      {posts.map((post) => (
        <article key={post.slug} className="post-row">
          <p className="post-row__meta">{getPostMeta(post)}</p>
          <h2 className="post-row__title">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          {post.description ? (
            <p className="post-row__description">{post.description}</p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
