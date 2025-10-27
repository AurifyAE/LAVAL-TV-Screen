import { useState, useEffect } from "react";
import { useConnectionState } from "use-connection-state";
import { SpotRateProvider } from "./context/SpotRateContext";
import "./App.css";
import TvScreen from "./pages/tvscreenView";
import ErrorPage from "./components/ErrorPage";

function App() {
  const [isTvScreen, setIsTvScreen] = useState(window.innerWidth >= 100);

  useEffect(() => {
    // Listen to resize changes
    const handleResize = () => {
      setIsTvScreen(window.innerWidth >= 100);
      scaleApp(); // Recalculate scale when screen changes
    };

    // Scaling function
    const scaleApp = () => {
      const app = document.getElementById("tv-app-container");
      if (!app) return;

      // Your base design dimensions (1080p layout)
      const baseWidth = 1920;
      const baseHeight = 1080;

      // Calculate scale based on window size
      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;
      const scale = Math.min(scaleX, scaleY);

      // Apply scale transform
      app.style.transform = `scale(${scale})`;
      app.style.transformOrigin = "top left";

      // Optional: keep centered
      const offsetX = (window.innerWidth - baseWidth * scale) / 2;
      const offsetY = (window.innerHeight - baseHeight * scale) / 2;
      app.style.position = "absolute";
      app.style.left = `${offsetX}px`;
      app.style.top = `${offsetY}px`;
    };

    // Initialize once
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
          width: "1920px",
          height: "1080px",
          overflow: "hidden",
        }}
      >
        {!isTvScreen ? <ErrorPage /> : <TvScreen />}
      </div>
    </SpotRateProvider>
  );
}

export default App;
