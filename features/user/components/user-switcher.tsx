"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { switchUser } from "@/features/user/user-actions";

export function UserSwitcher({ currentUserId }: { currentUserId: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const nextUserId = currentUserId === "ada" ? "grace" : "ada";

  return (
    <button
      className="border-divider dark:border-divider-dark hover:bg-card dark:hover:bg-card-dark bg-surface dark:bg-elevated-dark flex min-h-8 items-center justify-center rounded-lg border px-2.5 text-[0.8125rem] font-semibold transition-colors disabled:cursor-progress disabled:opacity-55"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await switchUser(nextUserId, pathname);
        });
      }}
      type="button"
    >
      {isPending ? "Switching…" : "Switch"}
    </button>
  );
}
