import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type Action = {
  label: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

type Toast = {
  id: number
  message: string
  type?: 'info' | 'error' | 'success'
  center?: boolean
  actions?: Action[]
  duration?: number
}

type ShowToastOptions = {
  center?: boolean
  actions?: Action[]
  duration?: number
}

type ToastContextValue = {
  showToast: (message: string, type?: Toast['type'], options?: ShowToastOptions) => number
  closeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const navigate = useNavigate()

  const closeToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const showToast = (message: string, type: Toast['type'] = 'info', options: ShowToastOptions = {}) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const toast: Toast = {
      id,
      message,
      type,
      center: !!options.center,
      actions: options.actions,
      duration: options.duration ?? (options.center ? 6000 : 4000),
    }
    setToasts((t) => [...t, toast])

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => closeToast(id), toast.duration)
    }

    return id
  }

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}

      {/* Top-right stack for non-centered toasts */}
      <div aria-live="polite" className="fixed z-50 right-4 top-4 flex flex-col gap-2">
        {toasts
          .filter((t) => !t.center)
          .map((toast) => (
            <div
              key={toast.id}
              className={`max-w-sm w-full px-4 py-2 rounded shadow-md text-white font-medium ${
                toast.type === 'error' ? 'bg-red-500' : toast.type === 'success' ? 'bg-green-500' : 'bg-zinc-800'
              }`}
              role="status"
            >
              {toast.message}
            </div>
          ))}
      </div>

      {/* Centered modal-like toasts */}
      {toasts
        .filter((t) => t.center)
        .map((toast) => (
            <div
              key={toast.id}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto max-w-lg w-full bg-black/100 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl text-center relative">
                {/* Close X in top-right */}
                <button
                  aria-label="Close"
                  onClick={() => closeToast(toast.id)}
                  className="absolute top-3 right-3 text-white/80 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full"
                >
                  ×
                </button>

                <p className={`text-lg font-medium text-white`}>
                  {toast.message}
                </p>
                {toast.actions && toast.actions.length > 0 && (
                  <div className="mt-4 flex justify-center gap-3">
                    {toast.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          try {
                            if (action.onClick) action.onClick()
                            if (action.to) navigate(action.to)
                          } catch (e) {
                            // swallow
                          } finally {
                            closeToast(toast.id)
                          }
                        }}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                          action.variant === 'primary'
                            ? 'bg-white text-black hover:bg-white/90'
                            : 'bg-transparent border border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        ))}
    </ToastContext.Provider>
  )
}

export default ToastProvider
