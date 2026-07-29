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
  const parts = body.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

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

    return part
  })
}
