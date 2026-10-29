const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}

export const listItems = () => request('/items')

export const createItem = (title) =>
  request('/items', { method: 'POST', body: JSON.stringify({ title }) })

export const updateItem = (id, patch) =>
  request(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteItem = (id) => request(`/items/${id}`, { method: 'DELETE' })
