"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { handleChatbotMessage } from "@/lib/actions/ai/chatbot-action";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: 0,
    role: "assistant",
    content: "Hi! I'm the MediClick Assistant. Ask me how to book, cancel, or find a doctor.",
  },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, open, sending]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || sending) return;

    setPrompt("");
    setSending(true);
    setHistory((h) => [...h, { id: Date.now(), role: "user", content: text }]);

    const result = await handleChatbotMessage(text);

    setHistory((h) => [
      ...h,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: result.message,
      },
    ]);
    setSending(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 60 }}>
      {open && (
        <div
          className="mb-3 flex h-[420px] w-[320px] flex-col rounded-lg border shadow-lg"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
              MediClick Assistant
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ color: "var(--fg-secondary)" }}
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
            {history.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-md px-2.5 py-1.5 text-sm whitespace-pre-wrap"
                  style={{
                    background: m.role === "user" ? "var(--bg-active)" : "var(--bg-hover)",
                    color: "var(--fg)",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <p className="text-xs" style={{ color: "var(--fg-secondary)" }}>
                Assistant is typing…
              </p>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex gap-2 border-t p-2" style={{ borderColor: "var(--border)" }}>
            <label className="sr-only" htmlFor="chatbot-prompt">
              Message the assistant
            </label>
            <textarea
              id="chatbot-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask a question…"
              className="flex-1 resize-none rounded-md border px-2 py-1.5 text-sm outline-none"
              style={{ background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--fg)" }}
            />
            <button
              type="submit"
              disabled={sending || !prompt.trim()}
              className="rounded-md px-3 py-1.5 text-sm text-white disabled:opacity-50"
              style={{ background: "#2563eb" }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat assistant"
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg text-xl"
        style={{ background: "#2563eb" }}
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
