import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const chatApiUrl = (import.meta.env.VITE_MIA_CHAT_API_URL ?? "").trim();

if (chatApiUrl) {
  try {
    const healthUrl = new URL(chatApiUrl);
    healthUrl.pathname = healthUrl.pathname.replace(/\/api\/chat\/?$/, "/api/health");

    void fetch(healthUrl, { method: "GET", mode: "cors" }).catch(() => undefined);
  } catch {
    // The chat component reports configuration errors when the user interacts with it.
  }
}

createRoot(document.getElementById("root")!).render(<App />);
