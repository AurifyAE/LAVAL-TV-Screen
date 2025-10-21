import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import LimitExceededModal from "../components/LimitExceededModal";
import SpotRate from "../components/SpotRate";
import CommodityTable from "../components/CommodityTable";
import NewsTicker from "../components/News";
import TradingViewWidget from "../components/TradingViewWidget";
import Carousel from "../components/Carousel";
import lavalLogo from "../assets/lavalLogo.png";
import {
  fetchSpotRates,
  fetchServerURL,
  fetchNews,
  fetchTVScreenData,
} from "../api/api";
import io from "socket.io-client";
import { useSpotRate } from "../context/SpotRateContext";

function TvScreen() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [serverURL, setServerURL] = useState("");
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState("");
  const [goldAskSpread, setGoldAskSpread] = useState("");
  const [silverBidSpread, setSilverBidSpread] = useState("");
  const [silverAskSpread, setSilverAskSpread] = useState("");
  const [symbols, setSymbols] = useState(["GOLD", "SILVER"]);
  const [error, setError] = useState(null);

  const { updateMarketData } = useSpotRate();

  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  updateMarketData(
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
          fetchNews(adminId),
        ]);

        const {
          commodities,
          goldBidSpread,
          goldAskSpread,
          silverBidSpread,
          silverAskSpread,
        } = spotRatesRes.data.info;
        setCommodities(commodities);
        setGoldBidSpread(goldBidSpread);
        setGoldAskSpread(goldAskSpread);
        setSilverBidSpread(silverBidSpread);
        setSilverAskSpread(silverAskSpread);

        const { serverURL } = serverURLRes.data.info;
        setServerURL(serverURL);

        setNews(newsRes.data.news.news);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();

    fetchTVScreenData(adminId)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setShowLimitModal(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setShowLimitModal(true);
        } else {
          console.error("Error:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  }, [adminId]);

  useEffect(() => {
    if (serverURL) {
      const socket = io(serverURL, {
        query: { secret: import.meta.env.VITE_APP_SOCKET_SECRET_KEY },
        transports: ["websocket"],
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
        socket.emit("request-data", symbols);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.on("market-data", (data) => {
        if (data && data.symbol) {
          setMarketData((prevData) => ({
            ...prevData,
            [data.symbol]: {
              ...prevData[data.symbol],
              ...data,
              bidChanged:
                prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                  ? data.bid > prevData[data.symbol].bid
                    ? "up"
                    : "down"
                  : null,
            },
          }));
        } else {
          console.warn("Received malformed market data:", data);
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        setError("An error occurred while receiving data");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [serverURL, symbols]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getFormattedDateParts = (date) => {
    const day = date.toLocaleDateString("en-GB", { weekday: "long" });
    const dayOfMonth = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = date
      .toLocaleDateString("en-GB", { month: "long" })
      .toUpperCase();
    const year = date.toLocaleDateString("en-GB", { year: "numeric" });

    return { day, date: dayOfMonth, month, year };
  };

  const getFormattedTimeWithoutSeconds = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentDate = new Date();
  const { day, date, month, year } = getFormattedDateParts(currentDate);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={6}
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Side: SpotRate */}
        <Grid item xs={12} md={5}>
          <SpotRate />
          <Carousel />

          {/* Contact Section */}
          <div className="mt-6 w-full">
            <div 
              className="w-full rounded-xl overflow-hidden shadow-lg"
              style={{ borderTop: "3px solid #A18038", backgroundColor: "#2C2B2A" }}
            >
              <div className="p-2">
                {/* Header */}
                <div className="text-center mb-2">
                  <h2 
                    className="font-bold" 
                    style={{ 
                      color: "#A18038", 
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "1.5vw"
                    }}
                  >
                    Get in Touch
                  </h2>
                </div>

                {/* Contact Items - Horizontal Layout */}
                <div className="flex flex-wrap gap-2">
                  {/* Phone */}
                  <div
                    className="flex gap-3 p-2 rounded-lg w-full"
                    style={{ backgroundColor: "rgba(161, 128, 56, 0.1)" }}
                  >
                    <div
                      className="rounded-full p-2 flex items-center justify-center w-9 h-9 flex-shrink-0"
                      style={{ backgroundColor: "#A18038" }}
                    >
                      <Phone sx={{ color: "#2C2B2A", fontSize: "1.1rem" }} />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold uppercase tracking-wider mb-1"
                        style={{ 
                          color: "#FFFFFF", 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.8vw"
                        }}
                      >
                        Phone
                      </div>
                      <div 
                        className="leading-relaxed"
                        style={{ 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.9vw"
                        }}
                      >
                        <a
                          href="tel:042955205"
                          className="hover:underline"
                          style={{ color: "#FFFFFF" }}
                        >
                          04 2955205
                        </a> 
                        <span className="mx-1" style={{ color: "#A18038" }}>/</span>
                        <a
                          href="tel:0505437352"
                          className="hover:underline"
                          style={{ color: "#FFFFFF" }}
                        >
                          0505437352
                        </a>
                        <span className="mx-1" style={{ color: "#A18038" }}>/</span>
                        <a
                          href="tel:0505437352"
                          className="hover:underline"
                          style={{ color: "#FFFFFF" }}
                        >
                          056 445 2445
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    className="flex gap-3 p-2 rounded-lg w-full"
                    style={{ backgroundColor: "rgba(161, 128, 56, 0.1)" }}
                  >
                    <div
                      className="rounded-full p-2 flex items-center justify-center w-9 h-9 flex-shrink-0"
                      style={{ backgroundColor: "#A18038" }}
                    >
                      <Email sx={{ color: "#2C2B2A", fontSize: "1.1rem" }} />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold uppercase tracking-wider mb-1"
                        style={{ 
                          color: "#FFFFFF", 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.8vw"
                        }}
                      >
                        Email
                      </div>
                      <div 
                        className="break-all"
                        style={{ 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.9vw"
                        }}
                      >
                        <a
                          href="mailto:Lavaljewellery@gmail.com"
                          className="hover:underline"
                          style={{ color: "#FFFFFF" }}
                        >
                          Lavaljewellery@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div
                    className="flex gap-3 p-2 rounded-lg w-full"
                    style={{ backgroundColor: "rgba(161, 128, 56, 0.1)" }}
                  >
                    <div
                      className="rounded-full p-2 flex items-center justify-center w-9 h-9 flex-shrink-0"
                      style={{ backgroundColor: "#A18038" }}
                    >
                      <LocationOn sx={{ color: "#2C2B2A", fontSize: "1.1rem" }} />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold uppercase tracking-wider mb-1"
                        style={{ 
                          color: "#FFFFFF", 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.8vw"
                        }}
                      >
                        Office
                      </div>
                      <div 
                        className="leading-relaxed"
                        style={{ 
                          color: "#FFFFFF", 
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.9vw"
                        }}
                      >
                        Hind Plaza 5A, Office 301 & 302, Deira Gold Souq, Dubai, UAE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Bar */}
              <div
                className="h-2"
                style={{
                  background: "linear-gradient(to right, #2C2B2A, #A18038, #2C2B2A)",
                }}
              />
            </div>
          </div>
        </Grid>

        {/* Side: Commodity Table */}
        <Grid item xs={12} md={7}>
          <Box
            className="flex flex-row items-center justify-between"
            sx={{ boxSizing: "border-box" }}
          >
            {/* Logo */}
            <Box
              className="flex flex-col items-center justify-between"
            >
              <img src={lavalLogo} alt="" className="w-96 h-52" />
            </Box>

            {/* Date Day */}
            <Box className="flex flex-col items-center justify-between">
              {/* Time */}
              <Box>
                <Typography
                  sx={{
                    color: "#CFA545",
                    fontSize: "4.5vw",
                    fontFamily: "Digital-7",
                  }}
                >
                  {getFormattedTimeWithoutSeconds(dateTime)}
                </Typography>
              </Box>
              <Box className="flex flex-row">
                <Typography
                  className="font-bold mx-2"
                  sx={{ fontSize: "1.4vw", color: "#CFA545", fontWeight: "600" }}
                >
                  {date}
                </Typography>
                <Typography
                  className="font-bold mx-2"
                  sx={{
                    fontSize: "1.4vw",
                    marginLeft: "13px",
                    color: "#CFA545",
                    fontWeight: "600",
                  }}
                >
                  {month}
                </Typography>
                <Typography
                  className="font-bold mx-2"
                  sx={{
                    fontSize: "1.4vw",
                    marginLeft: "13px",
                    color: "#CFA545",
                    fontWeight: "600",
                  }}
                >
                  {year}
                </Typography>
              </Box>
              <Typography
                className="font-semibold text-xl"
                sx={{ fontSize: "2vw", color: "#CFA545", fontWeight: "600", letterSpacing: 6 }}
              >
                {day.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          {/* Commodity Table */}
          <CommodityTable commodities={commodities} />
        </Grid>
      </Grid>

      {/* News Component */}
      <NewsTicker newsItems={news} />

      {/* Conditional rendering of the modal */}
      {showLimitModal && <LimitExceededModal />}
    </Box>
  );
}

export default TvScreen;