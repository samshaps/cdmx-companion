import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Toast } from '../components/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(message)
    timerRef.current = setTimeout(() => {
      setToast(null)
      timerRef.current = null
    }, 2000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
