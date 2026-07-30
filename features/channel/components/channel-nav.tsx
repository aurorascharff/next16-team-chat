'use client'

import { Pencil, Plus, X } from 'lucide-react'
import {
  startTransition,
  useActionState,
  useOptimistic,
  useRef,
  useState,
} from 'react'
import { channelLayoutReducer } from '@/features/channel/channel-layout-actions'
import {
  applyLayoutAction,
  type LayoutAction,
  type LayoutGroup,
  UNGROUPED,
} from '@/features/channel/channel-layout-reducer'
import { cn } from '@/lib/utils'
import { ChannelLink } from './channel-link'

type Props = {
  groups: LayoutGroup[]
}

export function ChannelNav({ groups: initialGroups }: Props) {
  const [groups, dispatch] = useActionState(channelLayoutReducer, initialGroups)
  const [optimisticGroups, addOptimistic] = useOptimistic(
    groups,
    applyLayoutAction,
  )
  const dragging = useRef<{ groupName: string; channelId: string } | null>(null)
  const [overGroup, setOverGroup] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string | null>(null)

  function runAction(action: LayoutAction) {
    startTransition(() => {
      addOptimistic(action)
      dispatch(action)
    })
  }

  function addGroup() {
    let index = optimisticGroups.length + 1
    let name = `New group ${index}`
    while (optimisticGroups.some((group) => group.name === name)) {
      index += 1
      name = `New group ${index}`
    }
    runAction({ name, type: 'addGroup' })
    setEditingName(name)
  }

  function deleteGroup(name: string) {
    runAction({ name, type: 'deleteGroup' })
  }

  function renameGroup(oldName: string, rawName: string) {
    setEditingName(null)
    const name = rawName.trim()
    if (!name || name === oldName) return
    runAction({ from: oldName, to: name, type: 'renameGroup' })
  }

  return (
    <nav
      aria-label="Channels"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
    >
      {optimisticGroups.map((group) => {
        const removable = group.name !== UNGROUPED

        return (
          <div
            className={cn(
              'flex flex-col gap-0.5 rounded-lg transition-colors',
              overGroup === group.name && 'bg-accent/5 dark:bg-accent/10',
            )}
            key={group.name}
            onDragOver={(event) => {
              if (!dragging.current) return
              event.preventDefault()
              setOverGroup(group.name)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setOverGroup((current) =>
                  current === group.name ? null : current,
                )
              }
            }}
            onDrop={(event) => {
              const state = dragging.current
              if (!state) return
              event.preventDefault()
              runAction({
                channelId: state.channelId,
                toGroup: group.name,
                toIndex: group.channels.length,
                type: 'move',
              })
              dragging.current = null
              setOverGroup(null)
            }}
          >
            {editingName === group.name ? (
              <input
                autoFocus
                className="text-muted dark:text-muted-dark focus:ring-accent min-h-6 w-full rounded border border-transparent bg-transparent px-2.5 py-1 text-xs font-semibold tracking-wide uppercase outline-none ring-inset focus:ring-1"
                defaultValue={group.name}
                onBlur={(event) => {
                  return renameGroup(group.name, event.target.value)
                }}
                onFocus={(event) => {
                  return event.currentTarget.select()
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
                )}
              >
                <p
                  className={cn(
                    'text-xs font-semibold tracking-wide uppercase select-none',
                    overGroup === group.name
                      ? 'text-accent'
                      : 'text-muted dark:text-muted-dark',
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
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/label:opacity-100">
                    <button
                      aria-label={`Rename ${group.name} group`}
                      className="text-muted dark:text-muted-dark hover:text-accent p-0.5 transition-colors"
                      onClick={() => {
                        return setEditingName(group.name)
                      }}
                      type="button"
                    >
                      <Pencil aria-hidden className="size-3" strokeWidth={2} />
                    </button>
                    <button
                      aria-label={`Delete ${group.name} group`}
                      className="text-muted dark:text-muted-dark p-0.5 transition-colors hover:text-black dark:hover:text-white"
                      onClick={() => {
                        return deleteGroup(group.name)
                      }}
                      type="button"
                    >
                      <X aria-hidden className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>
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
                        setOverGroup(group.name)
                      }
                    }}
                    onDragStart={(event) => {
                      event.stopPropagation()
                      dragging.current = {
                        channelId: channel.id,
                        groupName: group.name,
                      }
                    }}
                    onDrop={(event) => {
                      const state = dragging.current
                      if (!state) return
                      event.preventDefault()
                      event.stopPropagation()
                      const sameGroup = state.groupName === group.name
                      const fromIndex = sameGroup
                        ? group.channels.findIndex(
                            (c) => c.id === state.channelId,
                          )
                        : -1
                      const toIndex =
                        sameGroup &&
                        fromIndex !== -1 &&
                        fromIndex < channelIndex
                          ? channelIndex - 1
                          : channelIndex
                      runAction({
                        channelId: state.channelId,
                        toGroup: group.name,
                        toIndex,
                        type: 'move',
                      })
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
