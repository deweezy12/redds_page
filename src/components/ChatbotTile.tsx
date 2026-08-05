import { useEffect, useRef, useState } from "react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatResponse = {
  reply?: string;
  error?: string;
};

type ChatbotTileProps = {
  title: string;
};

const apiUrl = (import.meta.env.VITE_MIA_CHAT_API_URL ?? "").trim();
const isConfigured = apiUrl.length > 0;

const starterMessage = 
  "Hello World. I'm Oliver's private assistant, ask me anything.";

function buildHistory(messages: Message[]): Array<[string, string]> {
  const history: Array<[string, string]> = [];
  let pendingUserMessage: string | null = null;

  // Skip the first message (starter message)
  for (const message of messages.slice(1)) {
    if (message.role === "user") {
      if (pendingUserMessage) {
        history.push([pendingUserMessage, ""]);
      }
      pendingUserMessage = message.content;
      continue;
    }

    if (pendingUserMessage) {
      history.push([pendingUserMessage, message.content]);
      pendingUserMessage = null;
    }
  }

  if (pendingUserMessage) {
    history.push([pendingUserMessage, ""]);
  }

  return history;
}

export function ChatbotTile({ title }: ChatbotTileProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: starterMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFirstReplyPending, setIsFirstReplyPending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fixed scroll function - only scrolls within container, not the entire page
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    
    if (!message || isTyping) return;

    // Build history and add user message
    const history = buildHistory(messages);
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Check if API is configured
    if (!isConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "The chat backend isn't configured yet. Set VITE_MIA_CHAT_API_URL to connect to the API.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setIsFirstReplyPending(history.length === 0);
    setIsTyping(true);

    try {
      // Send request to backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history }),
      });

      // Parse and validate response
      const contentType = response.headers.get("content-type") ?? "";
      const raw = await response.text();

      if (!contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response (Status ${response.status}).`);
      }

      let data: ChatResponse;
      try {
        data = JSON.parse(raw) as ChatResponse;
      } catch {
        throw new Error("Invalid JSON response from server.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }

      // Add assistant reply
      const reply = String(data.reply ?? "").trim() || "No response received.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Request failed: ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsFirstReplyPending(false);
    }
  };

  const getRoleColor = (role: Message["role"]) => {
    switch (role) {
      case "system":
        return "text-blue-400/70";
      case "user":
        return "text-white/90";
      case "assistant":
        return "text-cyan-400/80";
      default:
        return "text-white/70";
    }
  };

  const getRolePrefix = (role: Message["role"]) => {
    switch (role) {
      case "system":
        return "$ ";
      case "user":
        return "> ";
      case "assistant":
        return "< ";
      default:
        return "";
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col bg-black/95 font-mono text-sm"
      aria-label={title}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-white/40 text-xs ml-2">media-impact-assistant</span>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {messages.map((message, index) => (
          <div
            key={`${message.timestamp.getTime()}-${index}`}
            className={`${getRoleColor(message.role)} leading-relaxed break-words`}
          >
            <span className="text-white/30">{getRolePrefix(message.role)}</span>
            {message.content}
          </div>
        ))}
        {isTyping && (
          <div className="text-cyan-400/60 leading-relaxed">
            <span className="text-white/30">{"< "}</span>
            {isFirstReplyPending ? (
              <span>
                Mein Bot reibt sich noch den Schlaf aus
                <span className="inline-flex w-6 justify-start" aria-hidden="true">
                  <span className="animate-pulse">...</span>
                </span>
                <span className="block mt-1 text-white/40">
                  Die erste Antwort dauert ein paar Sekunden, weil ich einen kostenlosen Hoster nutze. Bin gespannt, was du von meinem Bot hältst!
                </span>
              </span>
            ) : (
              <span className="animate-pulse">typing...</span>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 bg-white/5 px-4 py-3 flex items-center gap-2"
      >
        <span className="text-white/40 shrink-0">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 bg-transparent text-white/90 placeholder:text-white/30 outline-none disabled:opacity-50"
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="text-white/40 hover:text-white/80 transition-colors disabled:opacity-30 disabled:hover:text-white/40 text-lg"
          aria-label="Send message"
        >
          ↵
        </button>
      </form>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
