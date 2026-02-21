import { PostList } from "../components/PostList";
import { SiteHeader } from "../components/SiteHeader";

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="main-shell">
        <PostList ariaLabel="Blogbeiträge" />
      </main>
    </>
  );
}
