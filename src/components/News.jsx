import React from "react";
import { Box, Typography } from "@mui/material";

const NewsTicker = ({ newsItems }) => {
  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        marginTop: "25px",
        borderRadius: "10px",
      }}
    >
      <Box
        className="flex flex-col justify-center items-center"
        sx={{
          backgroundColor: "#A18038",
          color: "white",
          width: "200px",
          height: "100%",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
        }}
      >
        <Typography sx={{ fontSize: "1.6vw", fontWeight: "bold", padding: '0px' }}>
          LAVAL
        </Typography>
        <Typography
          sx={{
            fontSize: "1.2vw",
            fontWeight: "bold",
            padding: "0px",
            marginTop: "-10px",
          }}
        >
          Latest News
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          backgroundColor: "#2C2B2A",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "50px",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "inline-block",
            animation: "scroll 60s linear infinite",
            color: "black",
            fontSize: "2.5vw",
            textAlign: "center",
          }}
        >
          {newsItems.map((item, index) => (
            <Typography
              key={index}
              component="span"
              sx={{
                marginRight: "4vw",
                display: "inline-block",
                color: "white",
                fontSize: "2.5vw",
              }}
            >
              {item.description}
            </Typography>
          ))}
        </Box>
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default NewsTicker;
