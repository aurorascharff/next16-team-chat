'use client'

import * as Ariakit from '@ariakit/react'
import { Loader2 } from 'lucide-react'
import type { KeyboardEvent, RefObject } from 'react'
import { Suspense, useDeferredValue } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useUserSearch } from '@/features/user/hooks/use-users'

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
  onFocus,
  onKeyDown,
  onValueChange,
  placeholder,
  textareaRef,
  value,
}: {
  className?: string
  id?: string
  maxLength?: number
  onFocus?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onValueChange: (value: string, caretOffset?: number) => void
  placeholder?: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
}) {
  const combobox = Ariakit.useComboboxStore({ placement: 'top-start' })
  const searchValue = Ariakit.useStoreState(combobox, 'value')
  const open = Ariakit.useStoreState(combobox, 'open')
  const deferredSearch = useDeferredValue(searchValue)
  const isStale = searchValue !== deferredSearch

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
        data-component="MentionCombobox"
        id={id}
        maxLength={maxLength}
        render={
          <Textarea
            onChange={onChange}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            onPointerDown={combobox.hide}
            onScroll={combobox.render}
            placeholder={placeholder}
            ref={textareaRef}
            rows={3}
            variant="unstyled"
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
        data-component="MentionPicker"
        gutter={44}
        hidden={!open}
        portal
        store={combobox}
        style={{ viewTransitionName: 'none' }}
        unmountOnHide
      >
        <ErrorBoundary compact title="Couldn’t load people">
          <Suspense fallback={<MentionResultsFallback />}>
            <div className={isStale ? 'opacity-60 transition-opacity' : ''}>
              <MentionResults
                onSelect={onSelectMention}
                query={deferredSearch}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      </Ariakit.ComboboxPopover>
    </>
  )
}

function MentionResults({
  onSelect,
  query,
}: {
  onSelect: (handle: string) => void
  query: string
}) {
  const { data: users = [] } = useUserSearch(query)

  if (users.length === 0) {
    return (
      <div className="text-muted dark:text-muted-dark px-2.5 py-2 text-xs">
        No people found.
      </div>
    )
  }

  return users.map((user) => {
    return (
      <Ariakit.ComboboxItem
        className="data-active-item:bg-accent-fade flex w-full cursor-pointer items-center gap-2.5 px-2.5 py-1.5"
        focusOnHover
        key={user.id}
        onClick={() => onSelect(user.handle)}
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
  })
}

function MentionResultsFallback() {
  return (
    <div className="text-muted dark:text-muted-dark flex items-center gap-2 px-2.5 py-2 text-xs">
      <Loader2 aria-hidden className="size-3.5 animate-spin" />
      Loading people…
    </div>
  )
}
