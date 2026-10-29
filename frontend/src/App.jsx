import { useEffect, useState } from 'react'
import ItemForm from './components/ItemForm.jsx'
import ItemList from './components/ItemList.jsx'
import { createItem, deleteItem, listItems, updateItem } from './api.js'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listItems()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function run(action) {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const addItem = (title) =>
    run(async () => {
      const created = await createItem(title)
      setItems((current) => [created, ...current])
    })

  const toggleItem = (item) =>
    run(async () => {
      const updated = await updateItem(item.id, { done: !item.done })
      setItems((current) => current.map((i) => (i.id === updated.id ? updated : i)))
    })

  const removeItem = (item) =>
    run(async () => {
      await deleteItem(item.id)
      setItems((current) => current.filter((i) => i.id !== item.id))
    })

  const remaining = items.filter((item) => !item.done).length

  return (
    <main className="app">
      <header>
        <h1>ZapIA</h1>
        <p className="subtitle">Starter app · React + Vite · FastAPI · SQLite</p>
      </header>

      <section className="card">
        <ItemForm onAdd={addItem} busy={busy} />
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <ItemList items={items} onToggle={toggleItem} onDelete={removeItem} busy={busy} />
        )}
        {!loading && items.length > 0 && (
          <footer className="meta">
            {remaining} of {items.length} left
          </footer>
        )}
      </section>
    </main>
  )
}
