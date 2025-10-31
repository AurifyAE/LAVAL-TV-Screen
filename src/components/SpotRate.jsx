import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const getBackgroundColor = (change) => {
    if (change === "up") {
      return "#3b3b3b"; // Green color for increase
    } else if (change === "down") {
      return "#3b3b3b"; // Red color for decrease
    }
    return "#3b3b3b"; // White color for no change
  };

  const getColor = (change) => {
    if (change === "up") {
      return "#25b325"; // Green color for increase
    } else if (change === "down") {
      return "#f01a1a"; // Red color for decrease
    }
    return "white"; // Default color for no change
  };

  const renderSpotSection = (metal, data) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1vw",
      }}
    >
      {/* Spot rate section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
          backgroundColor: "transparent",
          border: "3px solid #2C2B2A",
          borderRadius: "10px",
        }}
      >
        <Box
          className="flex flex-row items-center justify-center"
          sx={{
            backgroundColor: "#2C2B2A",
            width: { xs: "120px", sm: "150px", md: "250px" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: metal === 'gold' ? "4vw" : "3.8vw", sm: metal === 'gold' ? "3.5vw" : "2.8vw", md: metal === 'gold' ? "2.5vw" : "2vw" },
              fontWeight: "600",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {metal}
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontSize: { xs: metal === 'gold' ? "3.5vw" : "3vw", sm: metal === 'gold' ? "2.5vw" : "2vw", md: metal === 'gold' ? "1.8vw" : "1.5vw" },
              color: "white",
              fontWeight: "600",
            }}
          >
            oz
          </Typography>
        </Box>
        <Box className="flex flex-row items-center justify-between p-4 w-full bg-[#2C2B2A]">
          <Box className="flex flex-col items-center justify-between w-full">
            <Box className="flex flex-row items-center justify-center">
              <Typography
                sx={{
                  fontSize: { xs: "3vw", sm: "2vw", md: "1.5vw" },
                  color: "white",
                  fontWeight: "500",
                }}
              >
                BID
              </Typography>
              <Box
                className="flex justify-center items-center"
                sx={{
                  marginLeft: "0.3vw",
                  backgroundColor: "#A18038",
                  width: { xs: "20px", sm: "23px", md: "26px" },
                  height: { xs: "20px", sm: "23px", md: "26px" },
                  borderRadius: "50%",
                  fontSize: { xs: "4vw", sm: "2.8vw", md: "1.1vw" },
                  fontWeight: "600",
                  color: "white",
                }}
              >
                $
              </Box>
            </Box>
            <Typography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: { xs: "5vw", sm: "3.5vw", md: "2.5vw" },
                fontWeight: "bold",
                margin: "0.2vw 0",
                padding: "0.4vw 0",
                borderRadius: "5px",
                color: getColor(data.bidChanged),
                backgroundColor: getBackgroundColor(data.bidChanged),
                width: { xs: "22vw", sm: "18vw", md: "12vw" },
                marginBottom: { xs: "1vw", sm: "1.5vw", md: "0.5vw" },
              }}
            >
              {data.bid}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#3b3b3b",
                borderRadius: "3px",
                width: { xs: "22vw", sm: "18vw", md: "12vw" },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "2.5vw", sm: "2vw", md: "1.5vw" },
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "0.5vw",
                }}
              >
                LOW {data.low}
              </Typography>
            </Box>
          </Box>
          {/* ASK section - identical structure to BID section */}
          <Box className="flex flex-col items-center justify-between w-full">
            <Box className="flex flex-row items-center justify-center">
              <Typography
                sx={{
                  fontSize: { xs: "3vw", sm: "2vw", md: "1.5vw" },
                  color: "white",
                  fontWeight: "500",
                }}
              >
                ASK
              </Typography>
              <Box
                className="flex justify-center items-center"
                sx={{
                  marginLeft: "0.3vw",
                  backgroundColor: "#A18038",
                  width: { xs: "20px", sm: "23px", md: "26px" },
                  height: { xs: "20px", sm: "23px", md: "26px" },
                  borderRadius: "50%",
                  fontSize: { xs: "4vw", sm: "2.8vw", md: "1.1vw" },
                  fontWeight: "600",
                  color: "white",
                }}
              >
                $
              </Box>
            </Box>
            <Typography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: { xs: "5vw", sm: "3.5vw", md: "2.5vw" },
                fontWeight: "bold",
                margin: "0.2vw 0",
                padding: "0.4vw 0",
                borderRadius: "5px",
                color: getColor(data.bidChanged),
                backgroundColor: getBackgroundColor(data.bidChanged),
                width: { xs: "22vw", sm: "18vw", md: "12vw" },
                marginBottom: { xs: "1vw", sm: "1.5vw", md: "0.5vw" },
              }}
            >
              {data.ask}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#3b3b3b",
                borderRadius: "3px",
                width: { xs: "22vw", sm: "18vw", md: "12vw" },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "2.5vw", sm: "2vw", md: "1.5vw" },
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "0.5vw",
                }}
              >
                HIGH {data.high}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      className="mx-auto rounded-lg mt-4"
      sx={{
        maxWidth: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "3vw", sm: "2vw", md: "1vw" } }}>
        {renderSpotSection("gold", goldData)}
        {renderSpotSection("silver", silverData)}
      </Box>
    </Box>
  );
};

export default SpotRate;