export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
