import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const base = import.meta.env.DEV ? '/api' : ''
      const res = await fetch(`${base}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const text = await res.text()
      setMessage(text)
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="username" style={styles.label}>
          User name
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
          autoComplete="username"
        />
        <label htmlFor="password" style={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    minWidth: '280px',
    background: '#fff',
  },
  title: {
    margin: '0 0 1.5rem',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.6rem 1rem',
    fontSize: '1rem',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '1rem',
    padding: '0.5rem',
    background: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
}
