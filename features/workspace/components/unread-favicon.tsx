'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { unreadChannelsQueryOptions } from '@/features/channel/channel-query-options'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'

const DEFAULT_FAVICON = '/logo.svg'

function createUnreadFavicon() {
  const canvas = document.createElement('canvas')
  canvas.height = 96
  canvas.width = 96

  const ctx = canvas.getContext('2d')
  if (!ctx) return DEFAULT_FAVICON

  const gradient = ctx.createLinearGradient(0, 0, 96, 96)
  gradient.addColorStop(0, '#2457FA')
  gradient.addColorStop(1, '#1D47CF')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(0, 0, 96, 96, 22)
  ctx.fill()

  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.arc(42, 38, 8, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(24, 70)
  ctx.lineTo(24, 66)
  ctx.quadraticCurveTo(24, 58, 32, 58)
  ctx.lineTo(52, 58)
  ctx.quadraticCurveTo(60, 58, 60, 66)
  ctx.lineTo(60, 70)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(64, 70)
  ctx.lineTo(64, 66)
  ctx.quadraticCurveTo(64, 60, 58, 57)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(62, 39, 8, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()

  ctx.fillStyle = '#EF4444'
  ctx.beginPath()
  ctx.arc(73, 23, 16, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(73, 23, 16, 0, Math.PI * 2)
  ctx.stroke()

  return canvas.toDataURL('image/png')
}

export function UnreadFavicon() {
  const { data: unreadChannels } = useQuery(unreadChannelsQueryOptions())
  const { data: unreadActivity } = useQuery(unreadActivityQueryOptions())

  const hasUnreadChannels = Object.keys(unreadChannels ?? {}).length > 0
  const hasUnreadActivity = Boolean(unreadActivity && unreadActivity.count > 0)
  const hasUnread = hasUnreadChannels || hasUnreadActivity

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>(
      'link[data-huddle-favicon]',
    )

    if (!link) {
      link = document.createElement('link')
      link.dataset.huddleFavicon = 'true'
      link.rel = 'icon'
      document.head.append(link)
    }

    const href = hasUnread ? createUnreadFavicon() : DEFAULT_FAVICON
    link.type = href.startsWith('data:') ? 'image/png' : 'image/svg+xml'
    link.href = href
  }, [hasUnread])

  return null
}
