import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";

export function NotFoundPage() {
  return (
    <>
      <SiteHeader compact />
      <main className="main-shell main-shell--article">
        <article className="article">
          <h2>Page not found</h2>
          <p>The requested page does not exist.</p>
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </article>
      </main>
    </>
  );
}
