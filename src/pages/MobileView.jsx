import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Phone, Email, LocationOn, AccessTime } from "@mui/icons-material";
import { useSpotRate } from "../context/SpotRateContext";
import { fetchSpotRates, fetchServerURL, fetchNews } from "../api/api";
import io from "socket.io-client";
import SpotRate from "../components/SpotRate";
import CommodityTable from "../components/CommodityTable";
import NewsTicker from "../components/News";
import lavalLogo from "../assets/lavalLogo.png";

/**
 * MobileView - responsive/mobile version of TvScreen
 *
 * Key improvements:
 * - updateMarketData called inside useEffect (avoids render loops)
 * - socket created once via ref and cleaned up properly
 * - defensive checks for API shapes
 * - responsive fonts via clamp()
 */

function MobileView() {
  const [dateTime, setDateTime] = useState(new Date());
  const [serverURL, setServerURL] = useState("");
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState("");
  const [goldAskSpread, setGoldAskSpread] = useState("");
  const [silverBidSpread, setSilverBidSpread] = useState("");
  const [silverAskSpread, setSilverAskSpread] = useState("");
  const symbolsRef = useRef(["GOLD", "SILVER"]);
  const socketRef = useRef(null);

  const { updateMarketData } = useSpotRate();
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  // Keep context updated when market data or spreads change (in a side-effect)
  useEffect(() => {
    // protect against calling updateMarketData before it's available
    if (typeof updateMarketData === "function") {
      updateMarketData(
        marketData,
        goldBidSpread,
        goldAskSpread,
        silverBidSpread,
        silverAskSpread
      );
    }
  }, [updateMarketData, marketData, goldBidSpread, goldAskSpread, silverBidSpread, silverAskSpread]);

  // Fetch initial data (spot rates, server url, news)
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId).catch((e) => {
            console.error("fetchSpotRates error:", e);
            return null;
          }),
          fetchServerURL().catch((e) => {
            console.error("fetchServerURL error:", e);
            return null;
          }),
          fetchNews(adminId).catch((e) => {
            console.error("fetchNews error:", e);
            return null;
          }),
        ]);

        if (!mounted) return;

        // Spot rates
        const spotInfo = spotRatesRes?.data?.info;
        if (spotInfo) {
          setCommodities(Array.isArray(spotInfo.commodities) ? spotInfo.commodities : []);
          setGoldBidSpread(spotInfo.goldBidSpread ?? "");
          setGoldAskSpread(spotInfo.goldAskSpread ?? "");
          setSilverBidSpread(spotInfo.silverBidSpread ?? "");
          setSilverAskSpread(spotInfo.silverAskSpread ?? "");
        } else {
          setCommodities([]);
        }

        // Server url
        const serverInfo = serverURLRes?.data?.info;
        if (serverInfo && serverInfo.serverURL) {
          setServerURL(serverInfo.serverURL);
        }

        // News - guard shape
        const newsItems = newsRes?.data?.news?.news ?? [];
        setNews(Array.isArray(newsItems) ? newsItems : []);
      } catch (err) {
        console.error("Unexpected loadData error:", err);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [adminId]);

  // WebSocket: create and manage socket in effect; only when serverURL is available
  useEffect(() => {
    if (!serverURL) return;
    // Prevent multiple sockets
    if (socketRef.current) return;

    const socket = io(serverURL, {
      query: { secret: import.meta.env.VITE_APP_SOCKET_SECRET_KEY },
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("MobileView connected to socket");
      // request initial symbols (use ref to avoid re-creating effect)
      socket.emit("request-data", symbolsRef.current);
    });

    socket.on("market-data", (data) => {
      // Defensive checks, merge into marketData
      if (data && data.symbol) {
        setMarketData((prev) => ({
          ...prev,
          [data.symbol]: {
            ...prev[data.symbol],
            ...data,
          },
        }));
      } else {
        console.warn("MobileView received malformed market data:", data);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("MobileView socket disconnected:", reason);
    });

    socket.on("error", (err) => {
      console.error("MobileView socket error:", err);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [serverURL]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatting helpers
  const getFormattedTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const day = dateTime.toLocaleDateString("en-GB", { weekday: "long" });
  const date = dateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 2,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 2, width: "100%" }}>
        <img
          src={lavalLogo}
          alt="Laval Logo"
          style={{ width: "60%", maxWidth: 220, display: "block", margin: "0 auto" }}
        />
      </Box>

      {/* Time & Date Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 1.5,
        }}
      >
        {/* Date - Left */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            sx={{
              color: "#CFA545",
              fontSize: "clamp(12px, 4vw, 18px)",
              letterSpacing: 1,
              fontWeight: 600,
              mb: 0.3,
            }}
          >
            {day.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              color: "#CFA545",
              fontSize: "clamp(12px, 4vw, 18px)",
            }}
          >
            {date}
          </Typography>
        </Box>

        {/* Time - Right */}
        <Box sx={{ textAlign: "right" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
            <AccessTime sx={{ color: "#CFA545", fontSize: "clamp(12px, 4vw, 18px)" }} />
            <Typography
              sx={{
                color: "#CFA545",
                fontSize: "clamp(12px, 4vw, 18px)",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              {getFormattedTime(dateTime)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: "#CFA545", width: "60%", opacity: 0.3, mb: 1.5 }} />

      {/* Spot Rate */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <SpotRate />
      </Box>

      {/* Commodities (table) */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <CommodityTable commodities={commodities} />
      </Box>

      {/* News */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <NewsTicker newsItems={news} />
      </Box>

      {/* Contact Card */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#2C2B2A",
          borderRadius: 2,
          borderTop: "3px solid #A18038",
          p: 1.25,
          mt: 1,
        }}
      >
        <Typography
          align="center"
          sx={{
            color: "#A18038",
            fontWeight: "bold",
            fontSize: "clamp(14px, 4.8vw, 20px)",
            mb: 1,
          }}
        >
          Get in Touch
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
          <Phone sx={{ color: "#A18038", mr: 1, fontSize: "clamp(20px, 5vw, 28px)" }} />
          <Typography sx={{ fontSize: "clamp(12px, 3.8vw, 16px)" }}>
            <a href="tel:042955205" style={{ color: "white", textDecoration: "none" }}>
              04 2955205
            </a>{" "}
            /{" "}
            <a href="tel:0505437352" style={{ color: "white", textDecoration: "none" }}>
              0505437352
            </a>{" "}
            /{" "}
            <a href="tel:0564452445" style={{ color: "white", textDecoration: "none" }}>
              0564452445
            </a>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
          <Email sx={{ color: "#A18038", mr: 1, fontSize: "clamp(20px, 5vw, 28px)" }} />
          <Typography sx={{ fontSize: "clamp(12px, 3.8vw, 16px)", wordBreak: "break-all" }}>
            <a href="mailto:Lavaljewellery@gmail.com" style={{ color: "white", textDecoration: "none" }}>
              Lavaljewellery@gmail.com
            </a>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <LocationOn sx={{ color: "#A18038", mr: 1, fontSize: "clamp(20px, 5vw, 28px)" }} />
          <Typography sx={{ fontSize: "clamp(12px, 3.8vw, 16px)" }}>
            Hind Plaza 5A, Office 301 & 302, Deira Gold Souq, Dubai, UAE
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: "3px",
          width: "100%",
          background: "linear-gradient(to right, #2C2B2A, #A18038, #2C2B2A)",
          mt: 1,
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

export default MobileView;