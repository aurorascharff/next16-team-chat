"use client";

import { MessageSquare } from "lucide-react";
import type { Message } from "@/features/message/types/message";
import { cn } from "@/lib/utils";
import { formatInline, formatTime, initials } from "./format";
import { useThread } from "./thread-context";

export function MessageRow({
  message,
  showThreadAffordance = false,
}: {
  message: Message;
  showThreadAffordance?: boolean;
}) {
  const { openThread } = useThread();
  const sending = message.status === "sending";
  const failed = message.status === "failed";
  const replyCount = message.replyCount ?? 0;

  return (
    <article
      className={cn(
        "group hover:bg-card dark:hover:bg-card-dark flex gap-3 px-5 py-2.5 transition-colors",
        sending && "opacity-60",
      )}
    >
      <div
        aria-hidden
        className="bg-accent flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white uppercase"
      >
        {initials(message.userName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
          <strong className="text-[0.9375rem] font-semibold">
            {message.userName}
          </strong>
          <span className="text-muted dark:text-muted-dark text-xs">
            {formatTime(message.createdAt)}
          </span>
          {sending ? (
            <span className="text-muted dark:text-muted-dark text-xs">
              Sending…
            </span>
          ) : null}
          {failed ? (
            <span className="text-danger text-xs font-medium">
              Failed to send
            </span>
          ) : null}
        </div>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed break-words text-zinc-800 dark:text-zinc-200">
          {formatInline(message.body)}
        </p>
        {showThreadAffordance ? (
          <ThreadAffordance
            onOpen={() => {
              return openThread(message.channelId, message.id);
            }}
            replyCount={replyCount}
          />
        ) : null}
      </div>
    </article>
  );
}

function ThreadAffordance({
  onOpen,
  replyCount,
}: {
  onOpen: () => void;
  replyCount: number;
}) {
  if (replyCount > 0) {
    return (
      <button
        className="text-accent hover:bg-accent-fade mt-1.5 flex items-center gap-1.5 rounded-md py-0.5 pr-2 text-xs font-semibold transition-colors"
        onClick={onOpen}
        type="button"
      >
        <MessageSquare aria-hidden className="size-3.5" strokeWidth={2} />
        {replyCount} {replyCount === 1 ? "reply" : "replies"}
      </button>
    );
  }

  return (
    <button
      className="text-muted dark:text-muted-dark hover:text-accent mt-1 flex items-center gap-1.5 text-xs font-medium opacity-0 transition group-hover:opacity-100"
      onClick={onOpen}
      type="button"
    >
      <MessageSquare aria-hidden className="size-3.5" strokeWidth={2} />
      Reply in thread
    </button>
  );
}
