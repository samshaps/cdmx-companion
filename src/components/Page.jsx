import { navigate } from '../lib/router'

// Shared chrome for the non-trip screens (landing, create, organiser).
export function Page({ children }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-md mx-auto px-5 py-8">{children}</div>
    </div>
  )
}

export function Link({ to, children, className = '' }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()
        navigate(to)
      }}
      className={className}
    >
      {children}
    </a>
  )
}

export const buttonPrimary =
  'flex items-center justify-center w-full min-h-[48px] bg-teal text-white font-bold rounded-card shadow-card px-4 active:scale-[0.98] transition-transform disabled:opacity-50'
export const buttonSecondary =
  'flex items-center justify-center w-full min-h-[48px] border-2 border-teal text-teal font-bold rounded-card px-4 active:scale-[0.98] transition-transform'
export const inputClass =
  'w-full min-h-[48px] rounded-lg border border-charcoal/20 bg-white px-3 text-charcoal outline-none focus:border-teal'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-charcoal mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-charcoal/50 mt-1">{hint}</span>}
    </label>
  )
}
