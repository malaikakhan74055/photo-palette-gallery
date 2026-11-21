import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import outputs from '../amplify_outputs.json'
import './index.css'
import App from './App.jsx'
import Photos from './Photos.jsx'

Amplify.configure(outputs)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authenticator socialProviders={['google']}>
      {({ signOut }) => (
        <>
          <App signOut={signOut} />
          <Photos />
        </>
      )}
    </Authenticator>
  </StrictMode>,
)
