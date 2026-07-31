export async function fetchJson<Data>(url: string): Promise<Data> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed: ${url}`)
  }

  return response.json()
}
