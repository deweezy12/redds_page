import { PostList } from "../components/PostList";
import { SiteHeader } from "../components/SiteHeader";

export function ArchivesPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-shell main-shell--archives">
        <PostList ariaLabel="Archiv" />
      </main>
    </>
  );
}
