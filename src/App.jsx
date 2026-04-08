import { useState } from 'react'
import { TabBar } from './components/TabBar'
import { OnboardingOverlay } from './components/OnboardingOverlay'
import { ToastProvider } from './contexts/ToastContext'
import HomeTab from './pages/HomeTab'
import ScheduleTab from './pages/ScheduleTab'
import PhrasesTab from './pages/PhrasesTab'
import MoneyTab from './pages/MoneyTab'
import ExploreTab from './pages/ExploreTab'

const TAB_COMPONENTS = {
  home: HomeTab,
  schedule: ScheduleTab,
  phrases: PhrasesTab,
  money: MoneyTab,
  explore: ExploreTab,
}

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream pb-20">
        <OnboardingOverlay />
        <div key={activeTab} className="animate-fade-in">
          <ActiveComponent />
        </div>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ToastProvider>
  )
}

export default App
