import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { getPostMeta, postBySlug } from "../content/posts";

export function PostPage() {
  const { slug } = useParams();
  const post = slug ? postBySlug.get(slug) : undefined;

  if (!post) {
    return (
      <>
        <SiteHeader />
        <main className="main-shell">
          <article className="article">
            <h2>Beitrag nicht gefunden</h2>
            <p>Der angefragte Beitrag existiert nicht.</p>
            <p>
              <Link to="/">Zur Startseite</Link>
            </p>
          </article>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="main-shell">
        <article className="article">
          <h2 className="article__title">{post.title}</h2>
          <p className="article__meta">{getPostMeta(post)}</p>
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {post.resourceUrl ? (
            <p className="article__resource">
              <a href={post.resourceUrl} target="_blank" rel="noreferrer">
                {post.resourceLabel ?? "Anhang öffnen"}
              </a>
            </p>
          ) : null}
          <p>
            <Link to="/">Zurück zu allen Beiträgen</Link>
          </p>
        </article>
      </main>
    </>
  );
}
