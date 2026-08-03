export function getMessageTargetFromLocation({
  includeParent = false,
}: { includeParent?: boolean } = {}) {
  const match = window.location.pathname.match(
    /^\/channel\/([^/]+)(?:\/thread\/([^/]+))?/,
  )

  if (!match) return null

  return { channelId: match[1], parentId: includeParent ? match[2] : undefined }
}
