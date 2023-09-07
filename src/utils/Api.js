import axios from "axios";

const API_KEY = "2BW1UT3K30D1LNM3";

export const fetchStockData = async (symbol) => {
  const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

  try {
    const response = await axios.get(API_URL);
    // console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching stock data");
  }
};
