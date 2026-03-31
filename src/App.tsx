import { lazy, Suspense } from "react";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { RouteMap } from "./components/map/RouteMap";
import { FeedPanel } from "./components/feed/FeedPanel";
import { StopModal } from "./components/stops/StopModal";
import { AppProvider, useAppContext } from "./context/AppContext";

const PhotoSubmissionForm = lazy(() =>
  import("./components/photos/PhotoSubmissionForm").then((m) => ({
    default: m.PhotoSubmissionForm,
  })),
);

const PhotoGallery = lazy(() =>
  import("./components/photos/PhotoGallery").then((m) => ({
    default: m.PhotoGallery,
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
            <div style={{ width: "100%", height: "100%", minHeight: "640px" }}>
              <RouteMap
                selectedStopId={state.selectedStopId}
                onStopClick={(stopId) =>
                  dispatch({ type: "OPEN_STOP", stopId })
                }
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <Suspense fallback={null}>
                <PhotoSubmissionForm />
              </Suspense>
            </div>
          </>
        }
        feed={
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                borderRight: "1px solid var(--color-border)",
                overflowY: "auto",
                height: "100%",
              }}
            >
              <FeedPanel />
            </div>
            <div style={{ overflowY: "auto", height: "100%" }}>
              <Suspense fallback={null}>
                <PhotoGallery />
              </Suspense>
            </div>
          </div>
        }
      />
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
