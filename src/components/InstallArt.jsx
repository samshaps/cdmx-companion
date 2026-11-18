// Hand-drawn (in CSS) pictures of the phone screens an installer will see,
// with the thing to tap ringed in marigold. They are illustrations rather
// than screenshots so they stay crisp and need no image files.

function Phone({ children }) {
  return (
    <div className="mx-auto w-56 h-80 rounded-[2rem] border-[6px] border-charcoal bg-white overflow-hidden relative shadow-card">
      {children}
    </div>
  )
}

// A stand-in for the trip page behind the browser controls.
function PagePreview({ emoji }) {
  return (
    <div className="absolute inset-0 bg-cream">
      <div className="h-20 bg-teal/25 flex items-center justify-center text-3xl">{emoji}</div>
      <div className="p-3 space-y-2">
        <div className="h-3 w-28 rounded bg-charcoal/30" />
        <div className="h-2 w-36 rounded bg-charcoal/15" />
        <div className="h-10 rounded-lg bg-warm-gray" />
        <div className="h-10 rounded-lg bg-warm-gray" />
      </div>
    </div>
  )
}

function Ring({ children, className = '' }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className="absolute -inset-1.5 rounded-xl border-[3px] border-marigold animate-pulse" />
      {children}
    </span>
  )
}

export function ShareIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 15V3" />
      <path d="M8 7l4-4 4 4" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  )
}

export function AddSquareIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  )
}

function AppIcon({ emoji, size = 'w-10 h-10 text-xl' }) {
  return <span className={`${size} rounded-xl bg-teal flex items-center justify-center shadow`}>{emoji}</span>
}

// iPhone Safari: the Share button in the bottom toolbar.
export function IosShareArt({ emoji, top = false }) {
  const bar = (
    <div className={`absolute ${top ? 'top-0' : 'bottom-0'} inset-x-0 h-14 bg-white/95 border-charcoal/10 ${top ? 'border-b' : 'border-t'} flex items-center gap-2 px-3 text-[#007AFF]`}>
      {!top && <span className="text-lg text-charcoal/30">‹</span>}
      <div className="flex-1 h-8 rounded-full bg-charcoal/10 text-[10px] text-charcoal/50 flex items-center justify-center">your trip link</div>
      <Ring><ShareIcon /></Ring>
      {!top && <span className="text-lg leading-none">⋯</span>}
    </div>
  )
  return <Phone><PagePreview emoji={emoji} />{bar}</Phone>
}

function SheetRow({ icon, label, highlight }) {
  const row = (
    <div className="flex items-center justify-between w-full px-3 py-2.5 text-xs text-charcoal">
      <span className={highlight ? 'font-bold' : ''}>{label}</span>
      <span className="text-charcoal/60">{icon}</span>
    </div>
  )
  return highlight ? <Ring className="w-full">{row}</Ring> : row
}

// The share sheet, scrolled to "Add to Home Screen".
export function IosSheetArt({ emoji }) {
  return (
    <Phone>
      <PagePreview emoji={emoji} />
      <div className="absolute inset-0 bg-charcoal/30" />
      <div className="absolute bottom-0 inset-x-0 rounded-t-2xl bg-[#F2F2F7] p-3 pt-4">
        <div className="rounded-xl bg-white divide-y divide-charcoal/10 px-1">
          <SheetRow label="Copy" icon="⧉" />
          <SheetRow label="Add Bookmark" icon="☆" />
          <SheetRow label="Add to Home Screen" icon={<AddSquareIcon className="w-4 h-4" />} highlight />
          <SheetRow label="Find on Page" icon="⌕" />
        </div>
      </div>
    </Phone>
  )
}

// The confirmation screen with "Add" at the top right.
export function IosConfirmArt({ emoji, name }) {
  return (
    <Phone>
      <div className="absolute inset-0 bg-[#F2F2F7]">
        <div className="flex items-center justify-between px-3 pt-4 pb-3 text-xs text-[#007AFF]">
          <span>Cancel</span>
          <span className="text-charcoal font-bold">Add to Home Screen</span>
          <Ring><span className="font-bold">Add</span></Ring>
        </div>
        <div className="mx-3 rounded-xl bg-white p-3 flex items-center gap-3">
          <AppIcon emoji={emoji} />
          <span className="text-xs text-charcoal font-medium truncate">{name}</span>
        </div>
      </div>
    </Phone>
  )
}

// The pay-off: the trip sitting among the other apps.
export function HomeScreenArt({ emoji, name }) {
  return (
    <Phone>
      <div className="absolute inset-0 bg-gradient-to-b from-teal-light/60 to-teal p-4 grid grid-cols-3 gap-x-3 gap-y-4 content-start pt-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="w-11 h-11 rounded-xl bg-white/40" />
            <span className="h-1.5 w-8 rounded bg-white/50" />
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <Ring><AppIcon emoji={emoji} size="w-11 h-11 text-2xl" /></Ring>
          <span className="text-[9px] text-white font-medium truncate max-w-full mt-1">{name}</span>
        </div>
      </div>
    </Phone>
  )
}

// Android Chrome: the ⋮ menu at the top right.
export function AndroidMenuArt({ emoji }) {
  return (
    <Phone>
      <PagePreview emoji={emoji} />
      <div className="absolute top-0 inset-x-0 h-12 bg-white border-b border-charcoal/10 flex items-center gap-2 px-3">
        <div className="flex-1 h-7 rounded-full bg-charcoal/10 text-[10px] text-charcoal/50 flex items-center justify-center">your trip link</div>
        <Ring><span className="text-xl leading-none text-charcoal px-1">⋮</span></Ring>
      </div>
    </Phone>
  )
}

export function AndroidListArt({ emoji }) {
  return (
    <Phone>
      <PagePreview emoji={emoji} />
      <div className="absolute inset-0 bg-charcoal/20" />
      <div className="absolute top-2 right-2 w-44 rounded-lg bg-white shadow-card py-1">
        <SheetRow label="New tab" icon="" />
        <SheetRow label="Share…" icon="" />
        <SheetRow label="Add to Home screen" icon={<AddSquareIcon className="w-4 h-4" />} highlight />
        <SheetRow label="Translate…" icon="" />
      </div>
    </Phone>
  )
}

export function AndroidConfirmArt({ emoji, name }) {
  return (
    <Phone>
      <PagePreview emoji={emoji} />
      <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center p-4">
        <div className="w-full rounded-2xl bg-white p-4">
          <p className="text-xs font-bold text-charcoal mb-3">Install app</p>
          <div className="flex items-center gap-3 mb-4">
            <AppIcon emoji={emoji} />
            <span className="text-xs text-charcoal font-medium truncate">{name}</span>
          </div>
          <div className="flex justify-end gap-4 text-xs text-teal font-bold items-center">
            <span>Cancel</span>
            <Ring><span>Install</span></Ring>
          </div>
        </div>
      </div>
    </Phone>
  )
}

// In-app browsers (Instagram, etc.): get out to the real browser first.
export function OpenInBrowserArt({ emoji, browser }) {
  return (
    <Phone>
      <PagePreview emoji={emoji} />
      <div className="absolute top-0 inset-x-0 h-12 bg-white border-b border-charcoal/10 flex items-center justify-between px-3 text-charcoal">
        <span className="text-sm">✕</span>
        <span className="text-xl leading-none">⋯</span>
      </div>
      <div className="absolute top-10 right-2 w-44 rounded-lg bg-white shadow-card py-1">
        <SheetRow label="Copy link" icon="" />
        <SheetRow label={`Open in ${browser}`} icon="↗" highlight />
      </div>
    </Phone>
  )
}
