import { Link, NavLink } from "react-router-dom";
import { posts } from "../data/posts";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const latestPost = posts[0];

  return (
    <header className={`site-header${compact ? " site-header--compact" : ""}`}>
      <div className="site-header__inner">
        <div className="site-header__hero">
          <h1 className="site-header__title">
            <Link to={`/posts/${latestPost.slug}`}>The Redds</Link>
          </h1>
          <nav className="site-header__nav" aria-label="Main navigation">
            <NavLink to="/">Blog</NavLink>
            <NavLink to="/archives">Archives</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
