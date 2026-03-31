import { createContext, useContext, useReducer } from "react";

// ── State ────────────────────────────────────────────────────────────────────

interface AppState {
  /** The stop currently open in the modal, or null when closed. */
  selectedStopId: string | null;
  /** Whether the full community gallery overlay is visible. */
  showGallery: boolean;
  /** Dev-only: overrides Date.now() for the truck position simulation. null = use real time. */
  debugNow: Date | null;
}

const initialState: AppState = { selectedStopId: null, showGallery: false, debugNow: null };

// ── Actions ──────────────────────────────────────────────────────────────────

type AppAction =
  | { type: "OPEN_STOP"; stopId: string }
  | { type: "CLOSE_STOP" }
  | { type: "OPEN_GALLERY" }
  | { type: "CLOSE_GALLERY" }
  | { type: "SET_DEBUG_TIME"; date: Date }
  | { type: "CLEAR_DEBUG_TIME" };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "OPEN_STOP":
      return { ...state, selectedStopId: action.stopId };
    case "CLOSE_STOP":
      return { ...state, selectedStopId: null };
    case "OPEN_GALLERY":
      return { ...state, showGallery: true };
    case "CLOSE_GALLERY":
      return { ...state, showGallery: false };
    case "SET_DEBUG_TIME":
      return { ...state, debugNow: action.date };
    case "CLEAR_DEBUG_TIME":
      return { ...state, debugNow: null };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider>");
  }
  return ctx;
}
