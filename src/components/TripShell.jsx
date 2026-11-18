import { useState } from 'react'
import { TabBar } from './TabBar'
import { OnboardingOverlay } from './OnboardingOverlay'
import { ToastProvider } from '../contexts/ToastContext'
import { TripProvider } from '../contexts/TripContext'
import HomeTab from '../pages/HomeTab'
import ScheduleTab from '../pages/ScheduleTab'
import PhrasesTab from '../pages/PhrasesTab'
import MoneyTab from '../pages/MoneyTab'
import ExploreTab from '../pages/ExploreTab'

const TAB_COMPONENTS = {
  home: HomeTab,
  schedule: ScheduleTab,
  phrases: PhrasesTab,
  money: MoneyTab,
  explore: ExploreTab,
}

// The companion app itself: five tabs over one trip document.
export function TripShell({ data, banner }) {
  const [activeTab, setActiveTab] = useState('home')
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <TripProvider data={data}>
      <ToastProvider>
        <div className="min-h-screen bg-cream pb-20">
          <OnboardingOverlay />
          {banner && (
            <div className="bg-charcoal text-cream text-xs text-center py-1.5 px-4">{banner}</div>
          )}
          <div key={activeTab} className="animate-fade-in">
            <ActiveComponent />
          </div>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </ToastProvider>
    </TripProvider>
  )
}
