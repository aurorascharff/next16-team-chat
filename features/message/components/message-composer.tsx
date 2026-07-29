"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/features/message/message-actions";
import { messageKeys } from "@/features/message/message-query-options";
import type { Message } from "@/features/message/types/message";

export function MessageComposer({ channelId }: { channelId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optimisticIdRef = useRef(0);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function formatSelection(prefix: string, suffix = prefix) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const fallback = prefix === "`" ? "code" : "text";
    const value = selected || fallback;
    textarea.setRangeText(`${prefix}${value}${suffix}`, start, end, "select");
    textarea.focus();

    if (!selected) {
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + value.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = String(form.get("body") ?? "").trim();

    if (!body) {
      setError("Write a message first.");
      return;
    }

    const optimistic: Message = {
      body,
      channelId,
      createdAt: "2026-07-29T13:20:00.000Z",
      id: `optimistic-${channelId}-${optimisticIdRef.current++}`,
      optimistic: true,
      userId: "current",
      userName: "You",
    };
    const key = messageKeys.channel(channelId);

    setError("");
    formRef.current?.reset();
    queryClient.setQueryData<Message[]>(key, (current = []) => [
      ...current,
      optimistic,
    ]);

    startTransition(async () => {
      const result = await sendMessage({ body, channelId });

      if (!result.ok) {
        setError(result.error);
        queryClient.setQueryData<Message[]>(key, (current = []) =>
          current.filter((message) => message.id !== optimistic.id),
        );
        return;
      }

      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id ? result.message : message,
        ),
      );
    });
  }

  return (
    <form
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 sticky bottom-0 flex flex-col gap-2 border-t px-5 py-3 backdrop-blur-lg"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark focus-within:border-accent focus-within:ring-accent/20 flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors focus-within:ring-2">
        <div
          aria-label="Formatting"
          className="border-divider dark:border-divider-dark flex items-center gap-0.5 border-b p-1.5"
        >
          <button
            aria-label="Bold"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return formatSelection("**");
            }}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            aria-label="Italic"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return formatSelection("*");
            }}
            type="button"
          >
            <em>I</em>
          </button>
          <button
            aria-label="Inline code"
            className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md transition-colors hover:text-black dark:hover:text-white"
            onClick={() => {
              return formatSelection("`");
            }}
            type="button"
          >
            <code className="font-mono text-xs">{"<>"}</code>
          </button>
        </div>
        <label className="sr-only" htmlFor="body">
          Message
        </label>
        <textarea
          className="min-h-20 w-full resize-none bg-transparent px-3.5 py-3 text-sm leading-relaxed"
          id="body"
          maxLength={280}
          name="body"
          placeholder={`Message #${channelId}`}
          ref={textareaRef}
          rows={3}
        />
        <div className="border-divider dark:border-divider-dark flex items-center justify-end border-t p-1.5">
          <button
            className="bg-accent hover:bg-accent-hover flex min-h-8 items-center justify-center rounded-lg px-3.5 text-[0.8125rem] font-semibold text-white transition-colors disabled:cursor-progress disabled:opacity-55"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
      {error ? <p className="text-danger text-[0.8125rem]">{error}</p> : null}
    </form>
  );
}
