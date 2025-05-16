
import { useState, useMemo } from 'react'

type Item = {
  id: number
  name: string
  price: number
  avg: number
}

const mockData: Item[] = [
  { id: 1, name: 'АК-74 с глушителем', price: 54000, avg: 56200 },
  { id: 2, name: 'Костюм Долга', price: 120000, avg: 112000 },
  { id: 3, name: 'Патроны 5.45x39', price: 35, avg: 37 },
  { id: 4, name: 'Артефакт «Медуза»', price: 230000, avg: 220000 }
]

function App() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>(() => {
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) as number[] : []
  })
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let res = mockData.filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase()) && i.price >= 100
    )
    res = res.sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price)
    return res
  }, [query, sortAsc])

  function toggleFav(id: number) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Stalcraft Trade (Demo)</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="px-3 py-2 rounded bg-neutral-800 text-sm outline-none"
        />
        <button
          onClick={() => setSortAsc(a => !a)}
          className="px-3 py-2 rounded bg-neutral-700 text-sm hover:bg-neutral-600"
        >
          Сортировка: {sortAsc ? '↑ цена' : '↓ цена'}
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-neutral-800 text-left">
              <th className="p-2">Предмет</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Средняя</th>
              <th className="p-2">Избранное</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-neutral-800 hover:bg-neutral-800">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.price.toLocaleString()}₽</td>
                <td className="p-2">{item.avg.toLocaleString()}₽</td>
                <td className="p-2">
                  <button onClick={() => toggleFav(item.id)}>
                    {favorites.includes(item.id) ? '⭐' : '☆'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
