export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-warm-gray rounded-card shadow-card p-4 ${className}`}
    >
      {children}
    </div>
  )
}
