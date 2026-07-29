import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <EmptyState
        body="That route is not part of this workspace."
        title="Page not found"
      >
        <Link
          className="bg-accent hover:bg-accent-hover flex min-h-9 items-center justify-center rounded-lg px-3.5 text-[0.8125rem] font-semibold text-white transition-colors"
          href="/channel/ship-room"
        >
          Back to ship-room
        </Link>
      </EmptyState>
    </main>
  );
}
