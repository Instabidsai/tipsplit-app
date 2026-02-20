import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'

// Global unhandled error logging
window.addEventListener('error', (event) => {
  console.error('[TipSplit Global Error]', event.message, event.filename, event.lineno)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[TipSplit Unhandled Rejection]', event.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
