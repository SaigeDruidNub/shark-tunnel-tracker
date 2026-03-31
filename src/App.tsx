import { lazy, Suspense } from "react";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { RouteMap } from "./components/map/RouteMap";
import { FeedPanel } from "./components/feed/FeedPanel";
import { StopModal } from "./components/stops/StopModal";
import { InfoPanel } from "./components/info/InfoPanel";
import { AppProvider, useAppContext } from "./context/AppContext";

const GalleryPage = lazy(() =>
  import("./components/photos/GalleryPage").then((m) => ({
    default: m.GalleryPage,
  })),
);

function AppInner() {
  const { state, dispatch } = useAppContext();

  return (
    <>
      <Header />
      <Layout
        map={
          <>
            <div style={{
              margin: '12px var(--space-4) 0',
              border: '2px solid #00c9a0',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e8faf5 0%, #f0f0ff 100%)',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingBottom: '12px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-purple-brand)',
                padding: '10px 16px 6px',
                margin: 0,
              }}>
                Follow the Shark Tunnel!
              </h2>
              <div style={{ width: '100%', maxWidth: 'calc(55dvh * 1152 / 554)', marginInline: 'auto', border: '2px solid #00c9a0', borderRadius: '10px', overflow: 'hidden' }}>
                <RouteMap
                  selectedStopId={state.selectedStopId}
                  onStopClick={(stopId) =>
                    dispatch({ type: "OPEN_STOP", stopId })
                  }
                />
              </div>
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <InfoPanel
                onViewGallery={() => dispatch({ type: "OPEN_GALLERY" })}
              />
            </div>
          </>
        }
        feed={<FeedPanel />}
      />
      <StopModal />
      {state.showGallery && (
        <Suspense fallback={null}>
          <GalleryPage onClose={() => dispatch({ type: "CLOSE_GALLERY" })} />
        </Suspense>
      )}
      <StopModal />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
