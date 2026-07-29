import { getCurrentUser } from "@/features/user/user-queries";
import { UserSwitcher } from "./user-switcher";

export async function CurrentUserCard() {
  const user = await getCurrentUser();

  return (
    <section className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark mt-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border p-2.5">
      <div
        aria-hidden
        className="bg-accent flex size-9 items-center justify-center rounded-lg text-xs font-bold text-white uppercase"
      >
        {user.name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <span className="text-muted dark:text-muted-dark block truncate text-xs">
          {user.role}
        </span>
      </div>
      <UserSwitcher currentUserId={user.id} />
    </section>
  );
}

export function CurrentUserCardSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 rounded-xl border p-2.5">
      <div className="skeleton-animation size-9 rounded-lg" />
      <div className="flex flex-col gap-1.5">
        <div className="skeleton-animation h-3 w-24 rounded-full" />
        <div className="skeleton-animation h-2.5 w-16 rounded-full" />
      </div>
    </section>
  );
}
