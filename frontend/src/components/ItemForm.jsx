import { useState } from 'react'

export default function ItemForm({ onAdd, busy }) {
  const [title, setTitle] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const value = title.trim()
    if (!value) return
    await onAdd(value)
    setTitle('')
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        maxLength={200}
        aria-label="New item"
      />
      <button type="submit" disabled={busy || !title.trim()}>
        Add
      </button>
    </form>
  )
}
