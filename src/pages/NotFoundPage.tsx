import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";

export function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-shell">
        <article className="article">
          <h2>Seite nicht gefunden</h2>
          <p>Die angefragte Seite existiert nicht.</p>
          <p>
            <Link to="/">Zur Startseite</Link>
          </p>
        </article>
      </main>
    </>
  );
}
