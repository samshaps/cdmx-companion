import { useState } from 'react'
import { TabBar } from './TabBar'
import { InstallGuide } from './InstallGuide'
import { Link } from './Page'
import { ToastProvider } from '../contexts/ToastContext'
import { TripProvider } from '../contexts/TripContext'
import HomeTab from '../pages/HomeTab'
import ScheduleTab from '../pages/ScheduleTab'
import PhrasesTab from '../pages/PhrasesTab'
import MoneyTab from '../pages/MoneyTab'
import ExploreTab from '../pages/ExploreTab'
import { useSkin } from '../hooks/useSkin'
import { canShowInstallGuide, dismissInstallGuide, shouldAutoShowInstallGuide } from '../utils/platform'

const TAB_COMPONENTS = {
  home: HomeTab,
  schedule: ScheduleTab,
  phrases: PhrasesTab,
  money: MoneyTab,
  explore: ExploreTab,
}

// The companion app itself: five tabs over one trip document.
// `installable` trips walk first-time phone visitors through adding the app
// to their home screen; `editHref` shows organisers a way back to the editor.
export function TripShell({ data, banner, installable = false, editHref }) {
  const [activeTab, setActiveTab] = useState('home')
  useSkin(data.trip.skin)
  const [installOpen, setInstallOpen] = useState(() => installable && shouldAutoShowInstallGuide())
  const [canInstall] = useState(() => installable && canShowInstallGuide())

  function closeInstall() {
    dismissInstallGuide()
    setInstallOpen(false)
  }
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <TripProvider data={data}>
      <ToastProvider>
        <div className="min-h-screen bg-cream pb-20">
          {installOpen && <InstallGuide name={data.trip.name} emoji={data.trip.emoji} onClose={closeInstall} />}
          {editHref && (
            <Link to={editHref} className="fixed top-3 right-3 z-40 bg-white/90 text-teal text-sm font-bold rounded-full shadow-card px-3 py-1.5">
              ✏️ Edit
            </Link>
          )}
          {banner && (
            <div className="bg-charcoal text-cream text-xs text-center py-1.5 px-4">{banner}</div>
          )}
          <div key={activeTab} className="animate-fade-in">
            <ActiveComponent />
            {activeTab === 'home' && canInstall && (
              <div className="text-center pb-6">
                <button onClick={() => setInstallOpen(true)} className="min-h-[44px] text-teal font-medium text-sm underline underline-offset-2">
                  📲 Add this trip to your home screen
                </button>
              </div>
            )}
          </div>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </ToastProvider>
    </TripProvider>
  )
}
