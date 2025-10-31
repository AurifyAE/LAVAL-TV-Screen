import { useState, useEffect } from "react";
import { useConnectionState } from "use-connection-state";
import { SpotRateProvider } from "./context/SpotRateContext";
import "./App.css";
import TvScreen from "./pages/tvscreenView";
import ErrorPage from "./components/ErrorPage";
import MobileView from "./pages/MobileView";

function App() {
  const [isTvScreen, setIsTvScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const app = document.getElementById("tv-app-container");

    const scaleApp = () => {
      if (!app) return;

      const baseWidth = 1920;
      const baseHeight = 1080;

      // Only apply scaling for larger screens (TVs or PCs)
      if (window.innerWidth >= 1024) {
        const scaleX = window.innerWidth / baseWidth;
        const scaleY = window.innerHeight / baseHeight;
        const scale = Math.min(scaleX, scaleY);

        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = "top left";

        const offsetX = (window.innerWidth - baseWidth * scale) / 2;
        const offsetY = (window.innerHeight - baseHeight * scale) / 2;

        app.style.position = "absolute";
        app.style.left = `${offsetX}px`;
        app.style.top = `${offsetY}px`;
      } else {
        // On mobile, reset scaling and allow responsive layout
        app.style.transform = "none";
        app.style.position = "relative";
        app.style.left = "0";
        app.style.top = "0";
        app.style.width = "100%";
        app.style.height = "auto";
      }
    };

    const handleResize = () => {
      setIsTvScreen(window.innerWidth >= 1024);
      scaleApp();
    };

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
        {isTvScreen ? <TvScreen /> : <MobileView />}
      </div>
    </SpotRateProvider>
  );
}

export default App;