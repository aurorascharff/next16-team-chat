export function getMessageTargetFromLocation() {
  const match = window.location.pathname.match(
    /^\/channel\/([^/]+)(?:\/thread\/([^/]+))?/,
  )

  if (!match) return null

  return { channelId: match[1], parentId: match[2] }
}
