import { useRef } from 'react'
import { Header } from './components/layout/Header'
import { Layout } from './components/layout/Layout'
import { MapSVG } from './components/map/MapSVG'

function App() {
  const routePathRef = useRef<SVGPathElement>(null)

  return (
    <>
      <Header />
      <Layout
        map={
          <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <MapSVG ref={routePathRef} />
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
