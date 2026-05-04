import { useEffect, useRef, useState } from "react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatbotTileProps = {
  title: string;
};

export function ChatbotTile({ title }: ChatbotTileProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Hello! I'm the Media Impact Assistant. Ask me anything.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate assistant response (echo) with realistic delay
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: input.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500 + Math.random() * 500); // 500-1000ms delay
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
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
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
            <span className="animate-pulse">typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
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
