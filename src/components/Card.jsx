export function Card({ children, className = '', interactive = false }) {
  return (
    <div
      className={`bg-warm-gray rounded-card shadow-card p-4 ${
        interactive ? 'active:scale-[0.98] transition-transform duration-150' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
