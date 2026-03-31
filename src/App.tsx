import { Header } from './components/layout/Header'
import { Layout } from './components/layout/Layout'
import { RouteMap } from './components/map/RouteMap'

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
        feed={
          <div style={{ padding: '2rem', color: 'var(--color-purple-deep)' }}>
            <h2>📰 Feed coming soon</h2>
            <p>FeedPanel will render here.</p>
          </div>
        }
      />
    </>
  )
}

export default App
