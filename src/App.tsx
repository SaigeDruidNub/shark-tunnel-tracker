import { lazy, Suspense } from "react";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { RouteMap } from "./components/map/RouteMap";
import { FeedPanel } from "./components/feed/FeedPanel";
import { StopModal } from "./components/stops/StopModal";
import { InfoPanel } from "./components/info/InfoPanel";
import { AppProvider, useAppContext } from "./context/AppContext";
import { DebugClock } from "./components/debug/DebugClock";

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
            <div
              style={{
                margin: "var(--space-4) 0 0",
                borderRadius: "12px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                padding: "var(--space-3)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--color-purple-brand)",
                  padding: "10px 16px 6px",
                  margin: 0,
                }}
              >
                Follow the Shark Tunnel!
              </h2>
              <div
                style={{
                  width: "100%",
                  maxWidth: "calc(42.75dvh * 1152 / 554)",
                  marginInline: "auto",
                  overflow: "hidden",
                  border: "2px solid white",
                  borderRadius: "10px",
                }}
              >
                <RouteMap
                  selectedStopId={state.selectedStopId}
                  onStopClick={(stopId) =>
                    dispatch({ type: "OPEN_STOP", stopId })
                  }
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  marginTop: "6px",
                  fontWeight: 600,
                }}
              >
                Tap a stop to see what happened there
              </p>
            </div>
            <div>
              <InfoPanel
                onViewGallery={() => dispatch({ type: "OPEN_GALLERY" })}
              />
            </div>
          </>
        }
        feed={<FeedPanel />}
      />
      <StopModal />
      <DebugClock />
      {state.showGallery && (
        <Suspense fallback={null}>
          <GalleryPage onClose={() => dispatch({ type: "CLOSE_GALLERY" })} />
        </Suspense>
      )}
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
