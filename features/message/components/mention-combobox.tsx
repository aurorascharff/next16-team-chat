'use client'

import * as Ariakit from '@ariakit/react'
import { useQuery } from '@tanstack/react-query'
import { KeyboardEvent, RefObject, useDeferredValue, useMemo } from 'react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { usersQueryOptions } from '@/features/user/user-query-options'

const MENTION_TRIGGER = '@'

function getTriggerOffset(element: HTMLTextAreaElement) {
  const { selectionStart, value } = element
  for (let i = selectionStart - 1; i >= 0; i--) {
    const char = value[i]
    if (char === MENTION_TRIGGER) {
      const before = value[i - 1]
      if (!before || /\s/.test(before)) return i
      return -1
    }
    if (char && /\s/.test(char)) return -1
  }
  return -1
}

function getTrigger(element: HTMLTextAreaElement) {
  const { selectionStart, value } = element
  const previousChar = value[selectionStart - 1]
  if (!previousChar) return null
  const secondPreviousChar = value[selectionStart - 2]
  const isIsolated = !secondPreviousChar || /\s/.test(secondPreviousChar)
  if (!isIsolated) return null
  return previousChar === MENTION_TRIGGER ? previousChar : null
}

function getSearchValue(element: HTMLTextAreaElement) {
  const offset = getTriggerOffset(element)
  if (offset === -1) return ''
  return element.value.slice(offset + 1, element.selectionStart)
}

function replaceValue(offset: number, searchValue: string, handle: string) {
  return (prevValue: string) => {
    return `${prevValue.slice(0, offset)}${MENTION_TRIGGER}${handle} ${prevValue.slice(
      offset + searchValue.length + 1,
    )}`
  }
}

export function MentionCombobox({
  className,
  id,
  maxLength,
  onKeyDown,
  onValueChange,
  placeholder,
  textareaRef,
  value,
}: {
  className?: string
  id?: string
  maxLength?: number
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onValueChange: (value: string, caretOffset?: number) => void
  placeholder?: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
}) {
  const combobox = Ariakit.useComboboxStore()
  const searchValue = Ariakit.useStoreState(combobox, 'value')
  const open = Ariakit.useStoreState(combobox, 'open')
  const deferredSearch = useDeferredValue(searchValue)
  const { data: users = [] } = useQuery(usersQueryOptions())

  const matches = useMemo(() => {
    const query = deferredSearch.toLowerCase()
    return users
      .filter((user) => {
        return (
          user.handle.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query)
        )
      })
      .slice(0, 6)
  }, [deferredSearch, users])

  const hasMatches = matches.length > 0

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (getTrigger(event.target) || getTriggerOffset(event.target) !== -1) {
      combobox.show()
    } else {
      combobox.hide()
    }
    onValueChange(event.target.value)
    combobox.setValue(getSearchValue(event.target))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      combobox.hide()
    }
    onKeyDown?.(event)
  }

  function onSelectMention(handle: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const offset = getTriggerOffset(textarea)
    if (offset === -1) return
    const search = getSearchValue(textarea)
    const nextValue = replaceValue(offset, search, handle)(value)
    onValueChange(nextValue, offset + 1 + handle.length + 1)
    combobox.setValue('')
    combobox.hide()
  }

  return (
    <>
      <Ariakit.Combobox
        autoSelect
        className={className}
        id={id}
        maxLength={maxLength}
        render={
          <textarea
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onPointerDown={combobox.hide}
            onScroll={combobox.render}
            placeholder={placeholder}
            ref={textareaRef}
            rows={3}
          />
        }
        setValueOnChange={false}
        showOnChange={false}
        showOnClick={false}
        showOnKeyPress={false}
        store={combobox}
        value={value}
      />
      <Ariakit.ComboboxPopover
        className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark z-30 w-56 overflow-hidden rounded-lg border shadow-lg"
        gutter={4}
        hidden={!hasMatches || !open}
        store={combobox}
        style={{ viewTransitionName: 'none' }}
        unmountOnHide
      >
        {matches.map((user) => {
          return (
            <Ariakit.ComboboxItem
              className="data-active-item:bg-accent-fade flex w-full cursor-pointer items-center gap-2.5 px-2.5 py-1.5"
              focusOnHover
              key={user.id}
              onClick={() => onSelectMention(user.handle)}
              value={user.handle}
            >
              <UserAvatar bot={user.id === 'bot'} name={user.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium">
                  {user.name}
                </span>
                <span className="text-muted dark:text-muted-dark block truncate text-xs">
                  @{user.handle}
                </span>
              </span>
            </Ariakit.ComboboxItem>
          )
        })}
      </Ariakit.ComboboxPopover>
    </>
  )
}
