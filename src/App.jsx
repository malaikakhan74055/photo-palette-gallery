import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import './App.css'

// Color-box idea based on my earlier "Random Color Generator" project.
// Author: Malaika Khan

const COUNT = 24

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

  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        const g = session.tokens?.idToken?.payload['cognito:groups']
        setGroups(Array.isArray(g) ? g : [])
      })
      .catch(() => setGroups([]))
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

  return (
    <main className="page">
      <div className="bar">
        <span>Groups: {groups.length ? groups.join(', ') : 'none yet'}</span>
        <button onClick={signOut}>Sign out</button>
      </div>

      <header className="top">
        <h1>Photo Palette Gallery</h1>
        <p>Generate colors, copy the ones you like.</p>
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
    </main>
  )
}
