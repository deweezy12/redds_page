import { Link, NavLink } from "react-router-dom";
import { posts } from "../content/posts";

export function SiteHeader() {
  const latestPostPath = posts[0] ? `/posts/${posts[0].slug}` : "/";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__hero">
          <h1 className="site-header__title">
            <Link to={latestPostPath}>The Redds</Link>
          </h1>
          <nav className="site-header__nav" aria-label="Hauptnavigation">
            <NavLink to={latestPostPath}>Blog</NavLink>
            <NavLink to="/archives">Archiv</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
