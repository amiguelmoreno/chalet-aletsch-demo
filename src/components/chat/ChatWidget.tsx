"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/cn";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { SUGGESTIONS, type Locale } from "@/lib/chat-faq";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const localeRaw = useLocale();
  const locale: Locale = (["de", "en", "fr", "it"] as Locale[]).includes(
    localeRaw as Locale,
  )
    ? (localeRaw as Locale)
    : "de";

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const suggestions = SUGGESTIONS[locale];

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("welcome") }]);
    }
  }, [open, messages.length, t]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const callApi = async (payload: { message?: string; faqId?: string }) => {
    setPending(true);
    setError(null);
    const startedAt = Date.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "rate_limited") setError(t("rateLimited"));
        else setError(t("genericError"));
        return;
      }

      // Simulated thinking — keyword matching is instant, but an instant
      // reply feels uncanny. Wait 700–1700 ms based on response length so
      // longer answers feel like more typing happened.
      const reply = String(data.reply ?? "");
      const target = Math.min(700 + reply.length * 8, 1700);
      const elapsed = Date.now() - startedAt;
      if (elapsed < target) {
        await new Promise((r) => setTimeout(r, target - elapsed));
      }

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setError(t("networkError"));
    } finally {
      setPending(false);
    }
  };

  const sendChip = async (faqId: string, label: string) => {
    if (pending) return;
    setShowSuggestions(false);
    setMessages((m) => [...m, { role: "user", content: label }]);
    await callApi({ faqId });
  };

  const sendDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || pending) return;
    setShowSuggestions(false);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setDraft("");
    await callApi({ message: trimmed });
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t("close") : t("open")}
        className={cn(
          "fixed bottom-24 md:bottom-28 right-4 md:right-6 z-40",
          "w-14 h-14 border border-ink-700 bg-forest-700 text-parchment-50",
          "shadow-[0_4px_24px_-6px_rgba(20,19,15,0.4)] hover:bg-forest-800 transition-colors",
          "flex items-center justify-center",
        )}
      >
        {open ? <CloseGlyph /> : <ChatGlyph />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          className={cn(
            "fixed bottom-44 md:bottom-48 right-4 md:right-6 z-40",
            "w-[calc(100vw-2rem)] md:w-[420px] h-[min(540px,75vh)]",
            "border border-ink-700/30 bg-parchment-50 shadow-[0_8px_40px_-8px_rgba(20,19,15,0.35)]",
            "flex flex-col",
          )}
        >
          <header className="flex items-center gap-3 px-5 py-4 border-b border-ink-700/15 bg-forest-800 text-parchment-50">
            <Edelweiss size={28} className="text-parchment-50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-lg leading-tight">{t("title")}</p>
              <p className="editorial-caps-sm text-parchment-200/70 mt-0.5">
                {t("subtitle")}
              </p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] text-[0.95rem] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-ink-700 text-parchment-50 px-3 py-2"
                    : "bg-parchment-100/60 text-ink-700 border-l-2 border-forest-700 pl-3 py-1",
                )}
              >
                {m.content}
              </div>
            ))}

            {showSuggestions && (
              <div className="flex flex-col items-start gap-2 pt-2">
                <p className="editorial-caps-sm text-forest-700/80">
                  {t("suggestionsLabel")}
                </p>
                {suggestions.map((sug) => (
                  <button
                    key={sug.faqId}
                    type="button"
                    onClick={() => sendChip(sug.faqId, sug.label)}
                    disabled={pending}
                    className="text-left text-sm border border-ink-700/30 hover:border-ink-700 hover:bg-parchment-100/60 px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            )}

            {pending && <TypingIndicator />}
            {error && <p className="text-sm text-seal italic">{error}</p>}
          </div>

          <form
            onSubmit={sendDraft}
            className="border-t border-ink-700/15 p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("placeholder")}
              disabled={pending}
              maxLength={500}
              className="flex-1 bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 px-1 font-serif text-[0.95rem]"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="editorial-caps-sm border border-ink-700 px-4 py-2 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 disabled:opacity-40 transition-colors"
            >
              {t("send")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="bg-parchment-100/60 border-l-2 border-forest-700 pl-3 py-2 max-w-[85%] inline-flex items-center gap-1.5 text-forest-700">
      <span className="typing-dot block w-1.5 h-1.5 rounded-full bg-current" />
      <span
        className="typing-dot block w-1.5 h-1.5 rounded-full bg-current"
        style={{ animationDelay: "0.18s" }}
      />
      <span
        className="typing-dot block w-1.5 h-1.5 rounded-full bg-current"
        style={{ animationDelay: "0.36s" }}
      />
    </div>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M 4 6 L 4 17 L 8 17 L 8 21 L 13 17 L 20 17 L 20 6 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.5" r="1" fill="currentColor" />
      <circle cx="13" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M 6 6 L 18 18 M 6 18 L 18 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
