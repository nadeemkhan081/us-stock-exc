import React, { useState, useEffect, useRef } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "chartjs-adapter-moment";
import Chart from "chart.js/auto";
import { fetchStockData } from "../utils/Api";
import StockPriceCard from "../components/StockPriceCard";
import SearchBar from "../components/SearchBar";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Tooltip, LinearScale, TimeScale } from "chart.js";

Chart.register(ChartDataLabels, Tooltip, LinearScale, TimeScale);

const getChartData = (data) => {
  if (!data || !data["Time Series (5min)"]) {
    console.error("Data or timestamp are missing or invalid.");
    return {};
  }
  const timestamps = Object.keys(data["Time Series (5min)"]);
  if (timestamps.length === 0) {
    console.error("No timestamps found in the data.");
    return {};
  }

  const prices = timestamps.map(
    (timestamp) => data["Time Series (5min)"][timestamp]["1. open"]
  );

  // console.log("Timestamps:", timestamps);
  // console.log("Prices:", prices);

  return {
    labels: timestamps,
    datasets: [
      {
        label: "Stock Price",
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };
};

// =====================Chart-Option==============================
const chartOptions = {
  scales: {
    x: {
      type: "time", //for x-axis
      time: {
        unit: "minute", //For time unit
      },
    },
    y: {
      beginAtZero: false,
    },
  },
  plugins: {
    datalabels: {
      display: false, //Stock-Price Removed
    },
  },
};

const StockPrice = () => {




  const [stockData, setStockData] = useState(null);
  const [searchedSymbol, setSearchedSymbol] = useState("");
  
 
  const [watchlist, setWatchlist] = useState([]);
  const [showChartIndex, setShowChartIndex] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const chartRefs = useRef([]);

  useEffect(() => {
    if (searchedSymbol !== "") {
      fetchStockData(searchedSymbol)
        .then((data) => {
          console.log("API Response:", data);
          setStockData(data);
        })
        .catch((error) => {
          console.error("Error fetching stock data:", error);
        });
    }
  }, [searchedSymbol]);

  useEffect(() => {
    console.log("Show Chart Index:", showChartIndex);
    console.log("Watchlist:", watchlist);
    console.log("Chart Instance:", chartInstance);

    if (showChartIndex !== null) {
      if (chartInstance) {
        chartInstance.destroy();
      }
      console.log("Creating chart for index:", showChartIndex);
      const newChartInstance = new Chart(chartRefs.current[showChartIndex], {
        type: "line",
        data: getChartData(watchlist[showChartIndex]),
        options: chartOptions,
      });
      console.log("New Chart Instance:", newChartInstance);
      setChartInstance(newChartInstance);
    }
  }, [showChartIndex]);

  // useEffect(() => {
  //   if (showChartIndex !== null && chartInstance && watchlist.length > showChartIndex) {
  //     chartInstance.destroy();
  //     const newChartInstance = new Chart(
  //       chartRefs.current[showChartIndex],
  //       {
  //         type: "line",
  //         data: getChartData(watchlist[showChartIndex]),
  //         options: chartOptions,
  //       }
  //     );
  //     setChartInstance(newChartInstance);
  //   }
  // }, [showChartIndex, chartInstance, watchlist]);

  const handleSearch = (symbol) => {
    setSearchedSymbol(symbol);
  };

  const addToWatchlist = () => {
    if (stockData) {
      setWatchlist([...watchlist, stockData]);
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ShowChartIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            U.S. Stock Exchange
          </Typography>
        </Toolbar>
      </AppBar>

      <SearchBar onSearch={handleSearch} />
      {stockData ? (
        <>
          <StockPriceCard stockData={stockData} />
          <Button variant="contained" onClick={addToWatchlist}>
            ADD TO WATCHLIST
          </Button>
        </>
      ) : (
        <p>
          {" "}
          # Enter a company symbol and click Search to see its current U.S.
          stock price.
        </p>
      )}

      <TableContainer component={Paper} sx={{ marginTop: "20px", maxHeight: 600, overflow: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#eae7e7" }}>
            <TableRow sx={{ fontWeight: 5000 }}>
              <TableCell>Company Symbol</TableCell>
              <TableCell>Stock Price</TableCell>
              <TableCell>Highest</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>Stock Tracking</TableCell>
              <TableCell>Remove</TableCell>

              {/* Add more table headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody style={{ maxHeight: "300px", overflow: "auto" }}>
            {watchlist.map((data, index) => {
              const latestTimestamp = Object.keys(
                data["Time Series (5min)"]
              )[0];

              const removeFromWatchlist = (index) => {
                const updatedWatchlist = [...watchlist];
                updatedWatchlist.splice(index, 1);
                setWatchlist(updatedWatchlist);
              };
              return (
                <TableRow key={index}>
                  <TableCell>{data["Meta Data"]["2. Symbol"]}</TableCell>
                  <TableCell>
                    ${data["Time Series (5min)"][latestTimestamp]["1. open"]}
                  </TableCell>
                  <TableCell>
                    ${data["Time Series (5min)"][latestTimestamp]["2. high"]}
                  </TableCell>
                  <TableCell>
                    {data["Time Series (5min)"][latestTimestamp]["5. volume"]}
                  </TableCell>
                  <TableCell>
                    {showChartIndex === index ? (
                      <canvas
                        ref={(el) => (chartRefs.current[index] = el)}
                        width={400}
                        height={200}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("Button Clicked");
                          setShowChartIndex(index);
                        }}
                      >
                        Show Chart
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => removeFromWatchlist(index)}>
                      {<DeleteOutlineOutlinedIcon />}
                    </Button>
                  </TableCell>
                  {/* Add more table cells as needed */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StockPrice;
