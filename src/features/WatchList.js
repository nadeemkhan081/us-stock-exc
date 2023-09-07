import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Watchlist = ({ watchlist }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Symbol</TableCell>
            <TableCell>Stock Value</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Highest</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {watchlist.map((item) => (
            <TableRow key={item.companySymbol}>
              <TableCell>{item.companySymbol}</TableCell>
              <TableCell>${item.stockValue}</TableCell>
              <TableCell>{item.volume}</TableCell>
              <TableCell>${item.highest}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Watchlist;
