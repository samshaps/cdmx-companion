import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Bump this version to force a hard refresh for all users.
// This clears all service worker caches and reloads the page.
const APP_VERSION = '2'

const storedVersion = localStorage.getItem('app-version')
if (storedVersion && storedVersion !== APP_VERSION) {
  localStorage.setItem('app-version', APP_VERSION)
  if ('caches' in window) {
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))).then(() => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(r => r.unregister())
          window.location.reload()
        })
      } else {
        window.location.reload()
      }
    })
  } else {
    window.location.reload()
  }
} else {
  localStorage.setItem('app-version', APP_VERSION)

  // Reload the page when a new service worker takes control so users
  // always see the latest content (avoids stale cache after deploys).
  if ('serviceWorker' in navigator) {
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
