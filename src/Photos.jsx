import { useEffect, useState } from 'react'
import { uploadData, list, getUrl, remove } from 'aws-amplify/storage'

export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await list({
          path: ({ identityId }) => `photos/${identityId}/`,
        })
        const withUrls = await Promise.all(
          result.items.map(async (item) => {
            const { url } = await getUrl({ path: item.path })
            return {
              path: item.path,
              url: url.toString(),
              name: item.path.split('/').pop(),
            }
          }),
        )
        if (!cancelled) setPhotos(withUrls)
      } catch (err) {
        console.error(err)
        if (!cancelled) setMessage('Could not load photos')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [version])

  async function onFile(e) {
    const input = e.target
    const file = input.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file')
      return
    }
    setBusy(true)
    setMessage('Uploading...')
    try {
      await uploadData({
        path: ({ identityId }) => `photos/${identityId}/${file.name}`,
        data: file,
        options: { contentType: file.type },
      }).result
      setMessage('Uploaded')
      setVersion((v) => v + 1)
    } catch (err) {
      console.error(err)
      setMessage('Upload failed')
    } finally {
      setBusy(false)
      input.value = ''
    }
  }

  async function deletePhoto(path) {
    try {
      await remove({ path })
      setVersion((v) => v + 1)
    } catch (err) {
      console.error(err)
      setMessage('Could not delete photo')
    }
  }

  return (
    <section className="page photos" aria-label="My photos">
      <h2>My photos</h2>
      <label className="upload">
        Upload a photo:{' '}
        <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
      </label>
      <p role="status">{message}</p>
      <div className="photo-grid">
        {photos.map((p) => (
          <figure key={p.path}>
            <img src={p.url} alt={p.name} />
            <figcaption>
              {p.name}{' '}
              <button onClick={() => deletePhoto(p.path)}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>
      {photos.length === 0 && <p>No photos yet.</p>}
    </section>
  )
}
