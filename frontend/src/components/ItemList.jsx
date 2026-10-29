export default function ItemList({ items, onToggle, onDelete, busy }) {
  if (!items.length) {
    return <p className="empty">No items yet — add the first one above.</p>
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className={item.done ? 'item done' : 'item'}>
          <label>
            <input
              type="checkbox"
              checked={item.done}
              disabled={busy}
              onChange={() => onToggle(item)}
            />
            <span>{item.title}</span>
          </label>
          <button
            className="delete"
            disabled={busy}
            onClick={() => onDelete(item)}
            aria-label={`Delete ${item.title}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
