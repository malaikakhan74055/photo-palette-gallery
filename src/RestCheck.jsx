import { useState } from 'react'
import { get } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'

export default function RestCheck() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function callApi() {
    setLoading(true)
    setResult('')
    try {
      const token = (await fetchAuthSession()).tokens?.idToken?.toString()
      const { body } = await get({
        apiName: 'photoPaletteRestApi',
        path: 'me',
        options: { headers: { Authorization: token } },
      }).response
      setResult(JSON.stringify(await body.json(), null, 2))
    } catch (err) {
      console.error(err)
      setResult('REST call failed: ' + (err.message || 'unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page rest" aria-label="REST API check">
      <h2>REST API check</h2>
      <button className="primary" onClick={callApi} disabled={loading}>
        Call REST API (/me)
      </button>
      <pre>{result}</pre>
    </section>
  )
}
