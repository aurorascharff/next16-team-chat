import { ThemeToggle } from '@/components/theme/theme-toggle'

const REPO_URL = 'https://github.com/aurorascharff/next16-messaging'

function GithubIcon() {
  return (
    <svg aria-hidden className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

export function SidebarControls() {
  return (
    <div className="flex items-center justify-between gap-2">
      <a
        aria-label="View source on GitHub"
        className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-black dark:hover:text-white"
        href={REPO_URL}
        rel="noreferrer"
        target="_blank"
      >
        <GithubIcon />
      </a>
      <ThemeToggle />
    </div>
  )
}
