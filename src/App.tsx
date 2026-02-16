import { Navigate, Route, Routes } from "react-router-dom";
import { ArchivesPage } from "./pages/ArchivesPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PostPage } from "./pages/PostPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/archives" element={<ArchivesPage />} />
      <Route path="/posts/:slug" element={<PostPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
