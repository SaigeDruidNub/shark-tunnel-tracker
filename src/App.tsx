import { Header } from './components/layout/Header'
import { Layout } from './components/layout/Layout'
import { RouteMap } from './components/map/RouteMap'
import { FeedPanel } from './components/feed/FeedPanel'
import { StopModal } from './components/stops/StopModal'
import { AppProvider, useAppContext } from './context/AppContext'

function AppInner() {
  const { state, dispatch } = useAppContext()

  return (
    <>
      <Header />
      <Layout
        map={
          <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <RouteMap
              selectedStopId={state.selectedStopId}
              onStopClick={(stopId) => dispatch({ type: 'OPEN_STOP', stopId })}
            />
          </div>
        }
        feed={<FeedPanel />}
      />
      <StopModal />
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

export default App
