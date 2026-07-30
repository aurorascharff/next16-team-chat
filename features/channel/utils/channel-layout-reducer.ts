export const UNGROUPED = 'Channels'

export type LayoutChannel = {
  id: string
  isPrivate?: boolean
  name: string
  unread?: number
}

export type LayoutGroup = {
  name: string
  channels: LayoutChannel[]
}

export type LayoutAction =
  | {
      type: 'move'
      channelId: string
      toGroup: string
      toIndex: number
    }
  | { type: 'addGroup'; name: string }
  | { type: 'renameGroup'; from: string; to: string }
  | { type: 'deleteGroup'; name: string }
  | { type: 'moveGroup'; name: string; direction: 'up' | 'down' }

function withUngroupedLast(groups: LayoutGroup[]): LayoutGroup[] {
  const named = groups.filter((group) => group.name !== UNGROUPED)
  const ungrouped = groups.find((group) => group.name === UNGROUPED)
  return ungrouped ? [...named, ungrouped] : named
}

export function applyLayoutAction(
  groups: LayoutGroup[],
  action: LayoutAction,
): LayoutGroup[] {
  switch (action.type) {
    case 'move': {
      const next = groups.map((group) => {
        return {
          ...group,
          channels: group.channels.filter(
            (channel) => channel.id !== action.channelId,
          ),
        }
      })
      const moved = groups
        .flatMap((group) => group.channels)
        .find((channel) => channel.id === action.channelId)
      if (!moved) return groups
      const target = next.find((group) => group.name === action.toGroup)
      if (!target) return groups
      const index = Math.max(
        0,
        Math.min(action.toIndex, target.channels.length),
      )
      target.channels.splice(index, 0, moved)
      return next
    }
    case 'addGroup': {
      if (groups.some((group) => group.name === action.name)) return groups
      return withUngroupedLast([...groups, { channels: [], name: action.name }])
    }
    case 'renameGroup': {
      const to = action.to.trim()
      if (
        !to ||
        to === UNGROUPED ||
        action.from === UNGROUPED ||
        groups.some((group) => group.name === to)
      ) {
        return groups
      }
      return groups.map((group) => {
        return group.name === action.from ? { ...group, name: to } : group
      })
    }
    case 'deleteGroup': {
      const target = groups.find((group) => group.name === action.name)
      if (!target || action.name === UNGROUPED) return groups
      const remaining = groups.filter((group) => group.name !== action.name)
      const existing = remaining.find((group) => group.name === UNGROUPED)
      const ungrouped: LayoutGroup = {
        channels: [...(existing?.channels ?? []), ...target.channels],
        name: UNGROUPED,
      }
      const next = existing
        ? remaining.map((group) =>
            group.name === UNGROUPED ? ungrouped : group,
          )
        : [...remaining, ungrouped]
      return withUngroupedLast(next)
    }
    case 'moveGroup': {
      if (action.name === UNGROUPED) return groups
      const movable = groups.filter((group) => group.name !== UNGROUPED)
      const index = movable.findIndex((group) => group.name === action.name)
      if (index === -1) return groups
      const target = action.direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= movable.length) return groups
      const next = [...movable]
      ;[next[index], next[target]] = [next[target], next[index]]
      return withUngroupedLast(next)
    }
    default:
      return groups
  }
}

export function toLayoutPayload(groups: LayoutGroup[]) {
  return {
    groups: groups.map((group) => {
      return {
        channelIds: group.channels.map((channel) => channel.id),
        name: group.name,
      }
    }),
  }
}
