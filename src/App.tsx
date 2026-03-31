import { Header } from './components/layout/Header'
import { Layout } from './components/layout/Layout'
import { RouteMap } from './components/map/RouteMap'
import { FeedPanel } from './components/feed/FeedPanel'

function App() {
  return (
    <>
      <Header />
      <Layout
        map={
          <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <RouteMap selectedStopId={null} onStopClick={() => {}} />
          </div>
        }
        feed={<FeedPanel />}
      />
    </>
  )
}

export default App
