import { useState } from 'react'
import './App.css'

// Author: Malaika Khan
// Based on my earlier "Random Color Generator" project, rewritten as a React component.

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

export default function App() {
  const [colors, setColors] = useState(makeColors)
  const [copied, setCopied] = useState('')

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
