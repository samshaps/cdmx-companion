// Pops up when a destination is recognised and the app has just changed
// into its flag's colours: a hello in the local language, and a way back.
export function SkinToast({ hello, emoji, place, onKeep, onRevert }) {
  return (
    <div role="status" aria-label="Trip colours changed" className="fixed inset-x-0 bottom-24 z-40 px-4 pointer-events-none animate-fade-in">
      <div className="max-w-md mx-auto bg-white rounded-card shadow-card border border-charcoal/10 p-4 pointer-events-auto">
        <p className="font-display text-xl font-bold text-teal">{hello} {emoji}</p>
        <p className="text-sm text-charcoal/70 mt-1">
          Your trip is now wearing the colours of {place}’s flag. Like it?
        </p>
        <div className="flex gap-4 mt-2">
          <button type="button" onClick={onKeep} className="min-h-[44px] font-bold text-teal">Keep them</button>
          <button type="button" onClick={onRevert} className="min-h-[44px] font-bold text-terracotta">Back to the original</button>
        </div>
      </div>
    </div>
  )
}
