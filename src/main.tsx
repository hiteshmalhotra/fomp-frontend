import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { useAuthStore } from '@/store/auth.store'
import { isTokenExpired } from '@/utils/jwt'
import 'antd/dist/reset.css'
import './index.css'

// ── Startup token guard ───────────────────────────────────────────────────────
// Runs once before React renders. If the persisted token is already expired,
// clear auth immediately so PrivateRoute never flashes a protected page.
const { token, clearAuth } = useAuthStore.getState()
if (token && isTokenExpired(token)) {
  clearAuth()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)