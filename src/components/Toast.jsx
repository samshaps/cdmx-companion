export function Toast({ message }) {
  return (
    <div
      className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-warm-gray text-charcoal text-sm px-4 py-2 rounded-lg shadow-card transition-opacity duration-200 pointer-events-none ${
        message ? 'opacity-100' : 'opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      {message || ''}
    </div>
  )
}
