import { useEffect, useMemo, useState } from 'react'
import { LanguagePicker } from './components/LanguagePicker'
import { TripShell } from './components/TripShell'
import { getDemoTrip } from './data/demo'
import { LocaleProvider, detectLocale, rememberLocale } from './i18n/LocaleContext'
import { syncManifestLink } from './lib/manifest'
import { useRoute } from './lib/router'
import GuestTrip from './pages/GuestTrip'
import Landing from './pages/Landing'
import ManageTrip from './pages/ManageTrip'
import NewTrip from './pages/NewTrip'

function App() {
  const route = useRoute()
  // The visitor's own language: used on the landing and create pages, and
  // handed to any trip they create. Inside a trip, the trip's language wins.
  const [locale, setLocale] = useState(detectLocale)
  const demoTrip = useMemo(() => {
    const demo = getDemoTrip()
    return { ...demo, trip: { ...demo.trip, locale } }
  }, [locale])

  useEffect(() => {
    syncManifestLink(route)
  }, [route.name, route.id]) // eslint-disable-line react-hooks/exhaustive-deps -- route is a fresh object each render

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  function chooseLocale(next) {
    rememberLocale(next)
    setLocale(next)
  }

  function screen() {
    switch (route.name) {
      case 'demo':
        return <TripShell data={demoTrip} />
      case 'new':
        return <NewTrip />
      case 'trip':
        return <GuestTrip key={route.id} id={route.id} />
      case 'edit':
        return <ManageTrip key={route.id} id={route.id} />
      default:
        return (
          <>
            <Landing />
            <LanguagePicker locale={locale} onChange={chooseLocale} />
          </>
        )
    }
  }

  return <LocaleProvider locale={locale}>{screen()}</LocaleProvider>
}

export default App
