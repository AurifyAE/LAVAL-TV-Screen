import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const CommodityTable = ({ commodities }) => {
  const { goldData, silverData } = useSpotRate();

  // Helper function to get bid and ask values based on metal type
  const getBidAskValues = (metal) => {
    if (
      metal === "gold" ||
      metal === "gold kilobar" ||
      metal === "gold ten tola"
    ) {
      return {
        bid: parseFloat(goldData.bid) || 0,
        ask: parseFloat(goldData.ask) || 0,
      };
    } else if (metal === "silver") {
      return {
        bid: parseFloat(silverData.bid) || 0,
        ask: parseFloat(silverData.ask) || 0,
      };
    }
    return { bid: 0, ask: 0 };
  };

  // Helper function to calculate purity power
  const calculatePurityPower = (purityInput) => {
    if (!purityInput || isNaN(purityInput)) return 1;
    return purityInput / Math.pow(10, purityInput.toString().length);
  };

  // Helper function to conditionally round values
  const formatValue = (value, weight) => {
    return weight === "GM" ? value.toFixed(2) : Math.round(value);
  };

  // Helper function to get the correct metal name
  const getMetalName = (metal) => {
    switch (metal.toLowerCase()) {
      case "gold":
        return "Gold";
      case "gold kilobar":
        return "Gold";
      case "gold ten tola":
        return "Gold";
      default:
        return metal.charAt(0).toUpperCase() + metal.slice(1);
    }
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: "",
        marginTop: "25px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#A18038",
              "& th": {
                borderBottom: "none",
              },
              "& th:first-of-type": {
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
              },
              "& th:last-of-type": {
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              },
            }}
          >
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2.5vw" },
                textAlign: "center",
                padding: { xs: "6px 8px", sm: "8px", md: "16px" },
              }}
              colSpan={2}
            >
              COMMODITY
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "4vw", sm: "3vw", md: "2vw" },
                textAlign: "center",
                padding: { xs: "6px 8px", sm: "8px", md: "16px" },
              }}
            >
              UNIT
            </TableCell>
            {/* <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5vw",
                textAlign: "center",
              }}
            >
              BID (AED)
            </TableCell> */}
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2.5vw" },
                textAlign: "center",
                padding: { xs: "6px 8px", sm: "8px", md: "16px" },
              }}
            >
              ASK (AED)
            </TableCell>
          </TableRow>
          <Box sx={{ height: "5px" }} />
        </TableHead>
        <Box sx={{ height: "8px" }}></Box>
        <TableBody>
          {commodities.map((commodity, index) => {
            const { bid, ask } = getBidAskValues(commodity.metal.toLowerCase());
            const {
              unit,
              weight,
              buyCharge,
              sellCharge,
              buyPremium,
              sellPremium,
              purity,
            } = commodity;

            // Ensure all values are numbers
            const unitMultiplier =
              {
                GM: 1,
                KG: 1000,
                TTB: 116.64,
                TOLA: 11.664,
                OZ: 31.1034768,
              }[weight] || 1;

            const weightValue = parseFloat(weight) || 0;
            const purityValue = parseFloat(purity) || 0;
            const purityPower = calculatePurityPower(purityValue);
            const buyChargeValue = parseFloat(buyCharge) || 0;
            const sellChargeValue = parseFloat(sellCharge) || 0;
            const buyPremiumValue = parseFloat(buyPremium) || 0;
            const sellPremiumValue = parseFloat(sellPremium) || 0;

            const biddingValue = bid + buyPremiumValue;
            const askingValue = ask + sellPremiumValue;
            const biddingPrice = (biddingValue / 31.103) * 3.674;
            const askingPrice = (askingValue / 31.103) * 3.674;

            // Calculation of buyPrice and sellPrice
            const buyPrice =
              biddingPrice * unitMultiplier * unit * purityPower +
              buyChargeValue;
            const sellPrice =
              askingPrice * unitMultiplier * unit * purityPower +
              sellChargeValue;

            return (
              <React.Fragment key={index}>
                <TableRow
                  sx={{
                    "& td": {
                      borderBottom: "none",
                    },
                    "& td:first-of-type": {
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    },
                    "& td:last-of-type": {
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                    },
                    backgroundColor: "#303030",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2.5vw" },
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "8px",
                    }}
                  >
                    {getMetalName(commodity.metal)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: { xs: "4vw", sm: "3vw", md: "2vw" },
                      textAlign: "left",
                      paddingLeft: "0px",
                      fontWeight: "600",
                      padding: "10px 8px",
                    }}
                  >
                    {purity === 916 ? '22K ' : purity === 875 ? '21K' : purity === 750 ? '18k' : purity}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2.5vw" },
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {unit} {weight}
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      color: "white",
                      fontSize: "1.5vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "6px",
                    }}
                  >
                    {formatValue(buyPrice, weight)}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2.5vw" },
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "0px 8px",
                    }}
                  >
                    {formatValue(sellPrice, weight)}
                  </TableCell>
                </TableRow>
                <Box height={{ xs: "1vw", sm: "1.5vw", md: "1.3vw" }}></Box>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommodityTable;