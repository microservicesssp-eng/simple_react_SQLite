import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const API_URL = '/api/greetings'

function App() {
  const [greetings, setGreetings] = useState([])
  const [form, setForm] = useState({ name: '', message: '' })
  const [status, setStatus] = useState('Загружаем сообщения...')
  const [saving, setSaving] = useState(false)

  async function loadGreetings() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`)
      setGreetings(await response.json())
      setStatus('')
    } catch (error) {
      setStatus(`Не удалось загрузить сообщения. ${error.message}`)
    }
  }

  useEffect(() => {
    loadGreetings()
  }, [])

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setStatus('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`)

      const savedGreeting = await response.json()
      setGreetings((current) => [...current, savedGreeting])
      setForm({ name: '', message: '' })
    } catch (error) {
      setStatus(`Не удалось сохранить сообщение. ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container">
      <h1>Гостевая книга</h1>
      <p>Сообщение из формы сохраняется в SQLite через Spring Boot.</p>

      <form onSubmit={submit}>
        <label>
          Ваше имя
          <input
            required
            maxLength="80"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Сообщение
          <textarea
            required
            maxLength="500"
            rows="3"
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
          />
        </label>
        <button disabled={saving}>
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>

      <section>
        <h2>Сообщения</h2>
        {status && <p role="status">{status}</p>}
        {!status && greetings.length === 0 && <p>Пока сообщений нет.</p>}
        <ul>
          {greetings.map((greeting) => (
            <li key={greeting.id}>
              <strong>{greeting.name}</strong>
              <span>{greeting.message}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
