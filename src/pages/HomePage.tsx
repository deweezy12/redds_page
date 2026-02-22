import { Navigate } from "react-router-dom";
import { posts } from "../content/posts";

export function HomePage() {
  const latestPost = posts[0];
  const fallbackPath = "/archives";

  if (!latestPost) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Navigate to={`/posts/${latestPost.slug}`} replace />;
}
