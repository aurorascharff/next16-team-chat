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

export function sortGroups(groups: LayoutGroup[]): LayoutGroup[] {
  return [...groups].sort((a, b) => {
    if (a.name === UNGROUPED) return 1
    if (b.name === UNGROUPED) return -1
    return a.name.localeCompare(b.name)
  })
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
      return sortGroups([...groups, { channels: [], name: action.name }])
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
      return sortGroups(
        groups.map((group) => {
          return group.name === action.from ? { ...group, name: to } : group
        }),
      )
    }
    case 'deleteGroup': {
      const target = groups.find((group) => group.name === action.name)
      if (!target || action.name === UNGROUPED) return groups
      const next = groups.filter((group) => group.name !== action.name)
      let ungrouped = next.find((group) => group.name === UNGROUPED)
      if (!ungrouped) {
        ungrouped = { channels: [], name: UNGROUPED }
        next.push(ungrouped)
      }
      ungrouped.channels = [...ungrouped.channels, ...target.channels]
      return sortGroups(next)
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
