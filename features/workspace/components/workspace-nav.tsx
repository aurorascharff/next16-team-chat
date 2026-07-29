"use client";

import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { AtSign, MessagesSquare, PencilLine, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkSectionSeen } from "@/features/notification/notification-mutations";
import { seenSectionsQueryOptions } from "@/features/notification/notification-query-options";
import { cn } from "@/lib/utils";

const REPO_URL = "https://github.com/aurorascharff/next16-messaging";

const links = [
  { badge: 4, href: "/inbox", icon: AtSign, label: "Inbox" },
  { badge: 0, href: "/threads", icon: MessagesSquare, label: "Threads" },
  { badge: 1, href: "/drafts", icon: PencilLine, label: "Drafts" },
] as const;

function GithubIcon() {
  return (
    <svg aria-hidden className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className="from-accent to-accent-hover flex size-8 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm"
    >
      <Users className="size-4" strokeWidth={2.5} />
    </span>
  );
}

export function WorkspaceNav() {
  const pathname = usePathname();
  const { data: seen = {} } = useQuery(seenSectionsQueryOptions());
  const markSeen = useMarkSectionSeen();

  useEffect(() => {
    const isSection = links.some((link) => {
      return link.href === pathname;
    });

    if (isSection && !seen[pathname]) {
      markSeen.mutate(pathname);
    }
  }, [pathname, seen, markSeen]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <Link
          className="hover:bg-card dark:hover:bg-card-dark flex flex-1 items-center gap-2.5 rounded-lg p-1.5 transition-colors"
          href="/channel/ship-room"
          prefetch={true}
        >
          <BrandMark />
          <span className="flex min-w-0 flex-col leading-tight">
            <strong className="text-[0.9375rem] font-semibold tracking-tight">
              Huddle
            </strong>
            <small className="text-muted dark:text-muted-dark text-xs">
              next16 workspace
            </small>
          </span>
        </Link>
        <a
          aria-label="View source on GitHub"
          className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-black dark:hover:text-white"
          href={REPO_URL}
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon />
        </a>
      </div>
      <nav aria-label="Workspace" className="flex flex-col gap-0.5">
        {links.map(({ badge, href, icon: Icon, label }) => {
          const active = pathname === href;
          const showBadge = badge > 0 && !seen[href];

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-fade text-accent"
                  : "text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark hover:text-black dark:hover:text-white",
              )}
              href={href as Route}
              key={href}
              prefetch={true}
            >
              <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
              <span className="flex-1 truncate">{label}</span>
              {showBadge ? (
                <span
                  className={cn(
                    "flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-bold",
                    active
                      ? "bg-accent text-white"
                      : "bg-accent-fade text-accent",
                  )}
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function WorkspaceNavSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 p-1.5">
        <BrandMark />
        <span className="flex flex-col leading-tight">
          <strong className="text-[0.9375rem] font-semibold tracking-tight">
            Huddle
          </strong>
          <small className="text-muted dark:text-muted-dark text-xs">
            next16 workspace
          </small>
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {["w-16", "w-20", "w-14"].map((width, i) => {
          return (
            <div className="flex min-h-8 items-center gap-2.5 px-2.5" key={i}>
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className={cn("h-3 rounded-full", width)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
