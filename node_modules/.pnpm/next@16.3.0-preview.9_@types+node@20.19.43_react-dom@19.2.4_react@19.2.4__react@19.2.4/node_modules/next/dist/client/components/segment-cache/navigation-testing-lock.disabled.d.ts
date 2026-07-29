/**
 * Inert stand-in for `./navigation-testing-lock`.
 *
 * When the Instant Navigation Testing API is disabled (a production build
 * without `experimental.exposeTestingApiInProductionBuild`), the browser
 * bundle resolves `./navigation-testing-lock` to this module instead of the
 * real implementation, so none of the lock machinery ships. The alias is set
 * up in `create-compiler-aliases.ts` (webpack) and
 * `crates/next-core/src/next_import_map.rs` (Turbopack).
 *
 * Every export mirrors the real module's signature and returns the value the
 * real implementation produces when no lock is held.
 */
import type { FlightRouterState } from '../../../shared/lib/app-router-types';
import type { PendingSegmentCacheEntry, SegmentCacheEntry } from './cache';
import type { FetchStrategy } from './types';
import type { NavigationLockPrefetch, NavigationLockState } from './navigation-testing-lock';
export type { NavigationLockPrefetch, NavigationLockState, } from './navigation-testing-lock';
export declare function getPreLockFetch(): typeof fetch | null;
export declare function beginNavigationLockPrefetch(): NavigationLockPrefetch | null;
export declare function recordNavigationLockOwnedEntry(_entry: SegmentCacheEntry): void;
export declare function trackNavigationLockPrefetchEntry(_prefetch: NavigationLockPrefetch, _entry: PendingSegmentCacheEntry): void;
export declare function finishNavigationLockPrefetchSpawning(_prefetch: NavigationLockPrefetch): void;
export declare function startListeningForInstantNavigationCookie(): void;
export declare function updateCapturedSPAToTree(_fromTree: FlightRouterState, _toTree: FlightRouterState): void;
export declare function isNavigationLocked(): boolean;
export declare function getCurrentNavigationLock(): NavigationLockState | null;
export declare function beginLockedNavigation(): Promise<void> | null;
export declare function getCurrentNavigationGate(): Promise<void> | null;
export declare function resetNavigationLockToPending(): void;
export declare function shouldRestrictNavigationToShell(_rootPrefetchHints: number, _linkFetchStrategy: FetchStrategy): boolean;
