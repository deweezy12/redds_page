import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change this when your repository name changes.
const repoName = "the-redds";

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`
});
