// src/components/ChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { getToken } from "../api/auth.api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Spinner = () => (
  <div className="flex gap-1 items-center px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-gray-400"
        style={{
          animation: `chatbounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`@keyframes chatbounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
  </div>
);

export default function ChatBot({ user, userType }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! 👋 I'm your Route Pool assistant. Ask me anything about using the app or delivery logistics.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMessages.filter(
            (m, i) => !(m.role === "assistant" && i === 0),
          ),
          userType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || data.error || "Request failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "min(380px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 120px))",
            background: "#fff",
            border: "1px solid var(--border)",
          }}>
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "var(--sidebar)" }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent)" }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">
                Route Pool Assistant
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                Powered by Gemini
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
            style={{ background: "#F8F7F4" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: "var(--accent)" }}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      className="w-3 h-3">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === "user"
                      ? {
                          background: "var(--accent)",
                          color: "#fff",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "#fff",
                          color: "#111827",
                          border: "1px solid var(--border)",
                          borderBottomLeftRadius: "4px",
                        }
                  }>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: "var(--accent)" }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    className="w-3 h-3">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                    />
                  </svg>
                </div>
                <div
                  className="px-3 py-2 rounded-2xl bg-white border text-sm"
                  style={{
                    borderColor: "var(--border)",
                    borderBottomLeftRadius: "4px",
                  }}>
                  <Spinner />
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-500 text-center px-2 py-1 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            className="flex items-end gap-2 px-3 py-3 border-t flex-shrink-0"
            style={{ borderColor: "var(--border)", background: "#fff" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask a question…"
              rows={1}
              className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition-all"
              style={{
                borderColor: "var(--border)",
                fontFamily: "inherit",
                maxHeight: "96px",
                lineHeight: "1.5",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 96) + "px";
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background:
                  input.trim() && !loading ? "var(--accent)" : "var(--border)",
                color: input.trim() && !loading ? "#fff" : "#9CA3AF",
              }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ background: open ? "var(--sidebar)" : "var(--accent)" }}>
        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
