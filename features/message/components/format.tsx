import type { ReactNode } from 'react'

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatInline(body: string): ReactNode {
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

function formatLines(text: string, keyPrefix: string): ReactNode {
  const lines = text.split('\n')
  return lines.map((line, index) => {
    return (
      <span key={`${keyPrefix}-${index}`}>
        {formatInline(line)}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    )
  })
}

export function formatMarkdown(body: string): ReactNode {
  const lines = body.trim().split('\n')
  const nodes: ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  function flushParagraph() {
    if (paragraph.length === 0) return
    const key = `p-${nodes.length}`
    nodes.push(
      <p className="whitespace-pre-wrap" key={key}>
        {formatLines(paragraph.join('\n'), key)}
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
          return <li key={index}>{formatInline(item)}</li>
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
