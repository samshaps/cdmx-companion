import { useEffect } from 'react'
import { TripShell } from './components/TripShell'
import { getDemoTrip } from './data/demo'
import { syncManifestLink } from './lib/manifest'
import { useRoute } from './lib/router'
import GuestTrip from './pages/GuestTrip'
import Landing from './pages/Landing'
import ManageTrip from './pages/ManageTrip'
import NewTrip from './pages/NewTrip'

const demoTrip = getDemoTrip()

function App() {
  const route = useRoute()

  useEffect(() => {
    syncManifestLink(route)
  }, [route.name, route.id]) // eslint-disable-line react-hooks/exhaustive-deps -- route is a fresh object each render

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
      return <Landing />
  }
}

export default App
