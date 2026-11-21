import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/data'
import './App.css'

// Color-box idea based on my earlier "Random Color Generator" project.
// Author: Malaika Khan

const COUNT = 12
const client = generateClient()

function randomHex() {
  const chars = '0123456789ABCDEF'
  let code = '#'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * 16)]
  }
  return code
}

function makeColors() {
  return Array.from({ length: COUNT }, randomHex)
}

export default function App({ signOut }) {
  const [colors, setColors] = useState(makeColors)
  const [copied, setCopied] = useState('')
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('')
  const [saved, setSaved] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        const g = session.tokens?.idToken?.payload['cognito:groups']
        setGroups(Array.isArray(g) ? g : [])
      })
      .catch(() => setGroups([]))
  }, [])

  useEffect(() => {
    const sub = client.models.Palette.observeQuery().subscribe({
      next: ({ items }) => setSaved([...items]),
      error: (err) => {
        console.error(err)
        setMessage('Could not load saved palettes')
      },
    })
    return () => sub.unsubscribe()
  }, [])

  async function copyColor(hex) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setTimeout(() => setCopied(''), 1500)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  async function savePalette() {
    try {
      const { errors } = await client.models.Palette.create({
        name: name.trim() || 'Untitled palette',
        colors,
      })
      if (errors) throw new Error(errors[0].message)
      setName('')
      setMessage('Palette saved')
    } catch (err) {
      console.error(err)
      setMessage('Could not save palette')
    }
  }

  async function deletePalette(id) {
    try {
      await client.models.Palette.delete({ id })
    } catch (err) {
      console.error(err)
      setMessage('Could not delete palette')
    }
  }

  return (
    <main className="page">
      <div className="bar">
        <span>Groups: {groups.length ? groups.join(', ') : 'none yet'}</span>
        <button onClick={signOut}>Sign out</button>
      </div>

      <header className="top">
        <h1>Photo Palette Gallery</h1>
        <p>Generate colors, copy the ones you like, save a palette.</p>
        <button className="primary" onClick={() => setColors(makeColors())}>
          Generate new colors
        </button>
      </header>

      <section className="grid" aria-label="Color swatches">
        {colors.map((hex, i) => (
          <article className="swatch" key={i} style={{ backgroundColor: hex }}>
            <span className="hex">{hex}</span>
            <button onClick={() => copyColor(hex)}>
              {copied === hex ? 'Copied' : 'Copy'}
            </button>
          </article>
        ))}
      </section>

      <section className="save">
        <input
          type="text"
          placeholder="Palette name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Palette name"
        />
        <button className="primary" onClick={savePalette}>
          Save this palette
        </button>
        <span role="status">{message}</span>
      </section>

      <section aria-label="Saved palettes">
        <h2>Saved palettes</h2>
        {saved.length === 0 && <p>No saved palettes yet.</p>}
        {saved.map((p) => (
          <div className="saved" key={p.id}>
            <strong>{p.name}</strong>
            <div className="chips">
              {(p.colors || []).map((c, i) => (
                <span
                  key={i}
                  className="chip"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <button onClick={() => deletePalette(p.id)}>Delete</button>
          </div>
        ))}
      </section>
    </main>
  )
}
