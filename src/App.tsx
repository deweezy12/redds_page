import { Navigate, Route, Routes } from "react-router-dom";
import { ArchivesPage } from "./pages/ArchivesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PostPage } from "./pages/PostPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts/redds-statuten" replace />} />
      <Route path="/archives" element={<ArchivesPage />} />
      <Route path="/posts/:slug" element={<PostPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
