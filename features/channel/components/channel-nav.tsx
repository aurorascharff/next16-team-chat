'use client'

import { Plus } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { saveChannelLayout } from '@/features/channel/channel-layout-actions'
import { cn } from '@/lib/utils'
import { ChannelLink } from './channel-link'

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

type DragState =
  | { type: 'group'; groupIndex: number }
  | { type: 'channel'; groupIndex: number; channelIndex: number }
  | null

export function ChannelNav({ groups: initialGroups }: Props) {
  const [groups, setGroups] = useState(initialGroups)
  const [, startTransition] = useTransition()
  const dragging = useRef<DragState>(null)
  const [overGroup, setOverGroup] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Keep local order in sync when the server sends fresh data (e.g. after a
  // switch user or cache revalidation).
  useEffect(() => {
    setGroups(initialGroups)
  }, [initialGroups])

  function persist(next: Group[]) {
    setGroups(next)
    startTransition(async () => {
      await saveChannelLayout({
        groups: next.map((group) => {
          return {
            channelIds: group.channels.map((channel) => channel.id),
            name: group.name,
          }
        }),
      })
    })
  }

  function moveGroup(from: number, to: number) {
    if (from === to) return
    const next = [...groups]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    persist(next)
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
    // Give the new group a unique working name, then let the user rename it.
    let index = groups.length + 1
    let name = `New group ${index}`
    while (groups.some((group) => group.name === name)) {
      index += 1
      name = `New group ${index}`
    }
    setGroups((current) => [...current, { channels: [], name }])
    setEditingIndex(groups.length)
  }

  function renameGroup(groupIndex: number, rawName: string) {
    setEditingIndex(null)
    const name = rawName.trim()
    const current = groups[groupIndex]
    if (!current) return
    // Reject empty or duplicate names; keep the previous value instead.
    if (
      !name ||
      groups.some((group, i) => i !== groupIndex && group.name === name)
    ) {
      setGroups([...groups])
      return
    }
    if (name === current.name) return
    const next = groups.map((group, i) => {
      return i === groupIndex ? { ...group, name } : group
    })
    persist(next)
  }

  return (
    <nav
      aria-label="Channels"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
    >
      {groups.map((group, groupIndex) => {
        return (
          <div
            className="flex flex-col gap-0.5"
            key={group.name}
            onDragOver={(event) => {
              const state = dragging.current
              if (!state || state.type !== 'channel') return
              // Allow dropping a channel into an empty area of another group.
              event.preventDefault()
              setOverGroup(groupIndex)
            }}
            onDrop={(event) => {
              const state = dragging.current
              if (!state || state.type !== 'channel') return
              event.preventDefault()
              // Drop at the end of the target group when not over a channel.
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
            {editingIndex === groupIndex ? (
              <input
                autoFocus
                className="text-muted dark:text-muted-dark bg-card dark:bg-card-dark focus:ring-accent/40 mx-2.5 mt-1 mb-1 rounded px-1 py-0.5 text-xs font-semibold tracking-wide uppercase focus:ring-2 focus:outline-none"
                defaultValue={group.name}
                onBlur={(event) => {
                  return renameGroup(groupIndex, event.target.value)
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
              <p
                className={cn(
                  'text-muted dark:text-muted-dark cursor-grab rounded px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase transition-colors select-none active:cursor-grabbing',
                  overGroup === groupIndex &&
                    dragging.current?.type === 'channel' &&
                    'text-accent',
                )}
                draggable
                onDoubleClick={() => {
                  return setEditingIndex(groupIndex)
                }}
                onDragEnd={() => {
                  dragging.current = null
                  setOverGroup(null)
                }}
                onDragOver={(event) => {
                  if (dragging.current?.type === 'group') {
                    event.preventDefault()
                  }
                }}
                onDragStart={(event) => {
                  event.stopPropagation()
                  dragging.current = { groupIndex, type: 'group' }
                }}
                onDrop={(event) => {
                  const state = dragging.current
                  if (!state || state.type !== 'group') return
                  event.preventDefault()
                  event.stopPropagation()
                  moveGroup(state.groupIndex, groupIndex)
                  dragging.current = null
                }}
                title="Drag to reorder, double-click to rename"
              >
                {group.name}
              </p>
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
                      if (dragging.current?.type === 'channel') {
                        event.preventDefault()
                        setOverGroup(groupIndex)
                      }
                    }}
                    onDragStart={(event) => {
                      event.stopPropagation()
                      dragging.current = {
                        channelIndex,
                        groupIndex,
                        type: 'channel',
                      }
                    }}
                    onDrop={(event) => {
                      const state = dragging.current
                      if (!state || state.type !== 'channel') return
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
              {group.channels.length === 0 && (
                <p className="text-muted/60 dark:text-muted-dark/60 px-2.5 py-1 text-xs italic">
                  Drop a channel here
                </p>
              )}
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
