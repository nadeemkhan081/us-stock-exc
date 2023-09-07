import React from "react";
import { Typography, Card, Grid, CardContent, Button } from "@mui/material";

const StockPriceCard = ({ stockData }) => {
  const companySymbol = stockData["Meta Data"]["2. Symbol"];
  const latestTimestamp = Object.keys(stockData["Time Series (5min)"])[0];
  const stockPrice = latestTimestamp
    ? stockData["Time Series (5min)"][latestTimestamp]["1. open"]
    : "N/A";
  const volume = latestTimestamp
    ? stockData["Time Series (5min)"][latestTimestamp]["5. volume"]
    : "N/A";
  const highest = latestTimestamp
    ? stockData["Time Series (5min)"][latestTimestamp]["2. high"]
    : "N/A";

  return (
    <Card sx={{ marginTop: "50px", backgroundColor: "#eae7e7" }}>
      <CardContent align="center">
        <Typography variant="h4" align="center">
          {companySymbol}
        </Typography>
        <Grid container spacing={2} alignItems="center" mt="50px">
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="div">
              Stock Value
            </Typography>
            <Typography variant="h6" component="div" color="textSecondary">
              ${stockPrice}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h5" component="div">
              Volume
            </Typography>
            <Typography variant="h6" component="div" color="textSecondary">
              {volume}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h5" component="div">
              Highest
            </Typography>
            <Typography
              variant="h6"
              component="div"
              color="textSecondary"
              sx={{ textTransform: "capitalize" }}
            >
              ${highest}
            </Typography>
          </Grid>
          {/* <Grid item xs={6} md={4}>
            <Typography variant="h6" component='div' color='textSecondary'>Add To Watchlist</Typography>
          </Grid> */}
        </Grid>
        {/* <Grid container justifyContent='flex-end' mb={5}>
            <Button variant="contained">Add List</Button>
          </Grid> */}
      </CardContent>
    </Card>
  );
};

export default StockPriceCard;
