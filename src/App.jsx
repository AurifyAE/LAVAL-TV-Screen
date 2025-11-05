import { useState, useEffect } from "react";
import { SpotRateProvider } from "./context/SpotRateContext";
import "./App.css";
import TvScreen from "./pages/tvscreenView";
import MobileView from "./pages/MobileView";

function App() {
  const [isTvScreen, setIsTvScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const app = document.getElementById("tv-app-container");

    const scaleApp = () => {
      if (!app) return;

      // Measure actual content height (we’ll use full width)
      const contentHeight = app.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (window.innerWidth >= 1024) {
        // Calculate only vertical scale factor
        const scaleY = viewportHeight / contentHeight;

        // Apply vertical scale only
        app.style.transform = `scaleY(${scaleY})`;
        app.style.transformOrigin = "top center";

        // Fill full width
        app.style.width = "100vw";
        app.style.position = "absolute";
        app.style.left = "0";
        app.style.top = "0";
        app.style.right = "0";
        app.style.margin = "0 auto";

        // Prevent scrollbars or extra space
        document.body.style.overflow = "hidden";
      } else {
        // Reset for mobile / tablet
        app.style.transform = "none";
        app.style.position = "relative";
        app.style.left = "0";
        app.style.top = "0";
        app.style.width = "100%";
        app.style.height = "auto";
        document.body.style.overflow = "auto";
      }
    };

    const handleResize = () => {
      setIsTvScreen(window.innerWidth >= 1024);
      scaleApp();
    };

    // Run on mount + resize
    scaleApp();
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", scaleApp);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", scaleApp);
    };
  }, []);

  return (
    <SpotRateProvider>
      <div
        id="tv-app-container"
        style={{
          width: "100vw",
          minHeight: "fit-content",
          overflow: "hidden",
        }}
      >
        {isTvScreen ? <TvScreen /> : <MobileView />}
      </div>
    </SpotRateProvider>
  );
}

export default App;
