import type { ReactNode } from 'react'

function isValidMention(token: string, validMentions?: Set<string>) {
  if (!validMentions) return true
  return validMentions.has(token.slice(1).toLowerCase())
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatRelativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime()
  const seconds = Math.max(0, Math.floor(elapsed / 1000))
  if (seconds < 45) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatInline(
  body: string,
  validMentions?: Set<string>,
): ReactNode {
  const parts = body.split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\)|@[A-Za-z][\w-]*)/g,
  )

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          className="bg-card dark:bg-card-dark border-divider dark:border-divider-dark rounded border px-1 py-0.5 font-mono text-[0.875em]"
          key={index}
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-semibold" key={index}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em className="italic" key={index}>
          {part.slice(1, -1)}
        </em>
      )
    }

    if (/^@[A-Za-z][\w-]*$/.test(part)) {
      if (!isValidMention(part, validMentions)) {
        return part
      }
      return (
        <span
          className="bg-accent-fade text-accent rounded px-1 font-medium"
          key={index}
        >
          {part}
        </span>
      )
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      return (
        <a
          className="text-accent hover:underline"
          href={link[2]}
          key={index}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link[1]}
        </a>
      )
    }

    return part
  })
}

function formatLines(
  text: string,
  keyPrefix: string,
  validMentions?: Set<string>,
): ReactNode {
  const lines = text.split('\n')
  return lines.map((line, index) => {
    return (
      <span key={`${keyPrefix}-${index}`}>
        {formatInline(line, validMentions)}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    )
  })
}

export function formatMarkdown(
  body: string,
  validMentions?: Set<string>,
): ReactNode {
  const lines = body.trim().split('\n')
  const nodes: ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  function flushParagraph() {
    if (paragraph.length === 0) return
    const key = `p-${nodes.length}`
    nodes.push(
      <p className="whitespace-pre-wrap" key={key}>
        {formatLines(paragraph.join('\n'), key, validMentions)}
      </p>,
    )
    paragraph = []
  }

  function flushList() {
    if (list.length === 0) return
    const items = list
    nodes.push(
      <ul className="list-disc space-y-0.5 pl-5" key={`ul-${nodes.length}`}>
        {items.map((item, index) => {
          return <li key={index}>{formatInline(item, validMentions)}</li>
        })}
      </ul>,
    )
    list = []
  }

  for (const line of lines) {
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      list.push(bullet[1])
      continue
    }

    flushList()
    if (line.trim() === '') {
      flushParagraph()
      continue
    }
    paragraph.push(line)
  }

  flushParagraph()
  flushList()

  return nodes
}
