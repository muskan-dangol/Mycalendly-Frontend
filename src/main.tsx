import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <Provider store={store}>
        <App />
      </Provider>
    </RecoilRoot>
  </StrictMode>,
);

// Used by the prerender build step to know when the app has mounted.
// Safe in normal runtime (no listeners).
const signalPrerenderReady = () =>
  document.dispatchEvent(new Event("prerender-ready"));
requestAnimationFrame(() => requestAnimationFrame(signalPrerenderReady));
