'use client'

import { Plus, X } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { saveChannelLayout } from '@/features/channel/channel-layout-actions'
import { cn } from '@/lib/utils'
import { ChannelLink } from './channel-link'

const UNGROUPED = 'Channels'

type Channel = {
  id: string
  isPrivate?: boolean
  name: string
  unread?: number
}

type Group = {
  name: string
  channels: Channel[]
}

type Props = {
  groups: Group[]
}

// Groups display alphabetically, with the ungrouped bucket always last.
function sortGroups(groups: Group[]) {
  return [...groups].sort((a, b) => {
    if (a.name === UNGROUPED) return 1
    if (b.name === UNGROUPED) return -1
    return a.name.localeCompare(b.name)
  })
}

export function ChannelNav({ groups: initialGroups }: Props) {
  const [groups, setGroups] = useState(initialGroups)
  const [, startTransition] = useTransition()
  const dragging = useRef<{ groupIndex: number; channelIndex: number } | null>(
    null,
  )
  const [overGroup, setOverGroup] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<string | null>(null)

  // Keep local state in sync when the server sends fresh data (e.g. after a
  // switch user or cache revalidation).
  useEffect(() => {
    setGroups(initialGroups)
  }, [initialGroups])

  function persist(next: Group[]) {
    const sorted = sortGroups(next)
    setGroups(sorted)
    startTransition(async () => {
      await saveChannelLayout({
        groups: sorted.map((group) => {
          return {
            channelIds: group.channels.map((channel) => channel.id),
            name: group.name,
          }
        }),
      })
    })
  }

  function moveChannel(
    fromGroup: number,
    fromChannel: number,
    toGroup: number,
    toChannel: number,
  ) {
    const next = groups.map((group) => {
      return { ...group, channels: [...group.channels] }
    })
    const [moved] = next[fromGroup].channels.splice(fromChannel, 1)
    const insertAt =
      fromGroup === toGroup && fromChannel < toChannel
        ? toChannel - 1
        : toChannel
    next[toGroup].channels.splice(insertAt, 0, moved)
    persist(next)
  }

  function addGroup() {
    let index = groups.length + 1
    let name = `New group ${index}`
    while (groups.some((group) => group.name === name)) {
      index += 1
      name = `New group ${index}`
    }
    setGroups(sortGroups([...groups, { channels: [], name }]))
    setEditingName(name)
  }

  function deleteGroup(name: string) {
    const target = groups.find((group) => group.name === name)
    if (!target) return
    const next = groups.filter((group) => group.name !== name)
    // Move the group's channels into the ungrouped bucket.
    let ungrouped = next.find((group) => group.name === UNGROUPED)
    if (!ungrouped) {
      ungrouped = { channels: [], name: UNGROUPED }
      next.push(ungrouped)
    }
    ungrouped.channels = [...ungrouped.channels, ...target.channels]
    persist(next)
  }

  function renameGroup(oldName: string, rawName: string) {
    setEditingName(null)
    const name = rawName.trim()
    if (
      !name ||
      name === UNGROUPED ||
      groups.some((group) => group.name !== oldName && group.name === name)
    ) {
      setGroups(sortGroups([...groups]))
      return
    }
    if (name === oldName) return
    persist(
      groups.map((group) => {
        return group.name === oldName ? { ...group, name } : group
      }),
    )
  }

  return (
    <nav
      aria-label="Channels"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
    >
      {groups.map((group, groupIndex) => {
        const removable = group.name !== UNGROUPED

        return (
          <div
            className="flex flex-col gap-0.5"
            key={group.name}
            onDragOver={(event) => {
              if (!dragging.current) return
              event.preventDefault()
              setOverGroup(groupIndex)
            }}
            onDrop={(event) => {
              const state = dragging.current
              if (!state) return
              event.preventDefault()
              moveChannel(
                state.groupIndex,
                state.channelIndex,
                groupIndex,
                groups[groupIndex].channels.length,
              )
              dragging.current = null
              setOverGroup(null)
            }}
          >
            {editingName === group.name ? (
              <input
                autoFocus
                className="text-muted dark:text-muted-dark bg-card dark:bg-card-dark focus:ring-accent/40 min-h-6 rounded px-2.5 py-1 text-xs font-semibold tracking-wide uppercase focus:ring-2 focus:outline-none"
                defaultValue={group.name}
                onBlur={(event) => {
                  return renameGroup(group.name, event.target.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur()
                  if (event.key === 'Escape') {
                    event.currentTarget.value = group.name
                    event.currentTarget.blur()
                  }
                }}
              />
            ) : (
              <div
                className={cn(
                  'group/label flex min-h-6 items-center justify-between rounded px-2.5 py-1 transition-colors',
                  overGroup === groupIndex && 'text-accent',
                )}
              >
                <p
                  className={cn(
                    'text-muted dark:text-muted-dark text-xs font-semibold tracking-wide uppercase select-none',
                    overGroup === groupIndex && 'text-accent',
                    removable && 'cursor-text',
                  )}
                  onDoubleClick={() => {
                    if (removable) setEditingName(group.name)
                  }}
                  title={removable ? 'Double-click to rename' : undefined}
                >
                  {group.name}
                </p>
                {removable && (
                  <button
                    aria-label={`Delete ${group.name} group`}
                    className="text-muted dark:text-muted-dark opacity-0 transition-opacity group-hover/label:opacity-100 hover:text-black dark:hover:text-white"
                    onClick={() => {
                      return deleteGroup(group.name)
                    }}
                    type="button"
                  >
                    <X aria-hidden className="size-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.channels.map((channel, channelIndex) => {
                return (
                  <div
                    className="cursor-grab active:cursor-grabbing"
                    draggable
                    key={channel.id}
                    onDragEnd={() => {
                      dragging.current = null
                      setOverGroup(null)
                    }}
                    onDragOver={(event) => {
                      if (dragging.current) {
                        event.preventDefault()
                        setOverGroup(groupIndex)
                      }
                    }}
                    onDragStart={(event) => {
                      event.stopPropagation()
                      dragging.current = { channelIndex, groupIndex }
                    }}
                    onDrop={(event) => {
                      const state = dragging.current
                      if (!state) return
                      event.preventDefault()
                      event.stopPropagation()
                      moveChannel(
                        state.groupIndex,
                        state.channelIndex,
                        groupIndex,
                        channelIndex,
                      )
                      dragging.current = null
                      setOverGroup(null)
                    }}
                  >
                    <ChannelLink channel={channel} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <button
        className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex min-h-8 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white"
        onClick={addGroup}
        type="button"
      >
        <Plus aria-hidden className="size-4 shrink-0" strokeWidth={2} />
        New group
      </button>
    </nav>
  )
}
