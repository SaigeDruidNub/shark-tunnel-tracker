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
            <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
              <RouteMap
                selectedStopId={state.selectedStopId}
                onStopClick={(stopId) =>
                  dispatch({ type: "OPEN_STOP", stopId })
                }
              />
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
