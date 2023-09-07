//Without Any Autocomplete/Search-Suggest=========================================================>

// import React, { useState } from "react";
// import { TextField, Button, Box } from "@mui/material";

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = () => {
//     if (searchTerm.trim() !== "") {
//       onSearch(searchTerm);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         marginTop: "50px",
//         justifyContent: "center",
//       }}
//     >
//       <TextField
//         label="Search"
//         variant="outlined"
//         size="small"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>
//         Search
//       </Button>
//     </Box>
//   );
// };

// export default SearchBar;


//With Reverse Indexing================================================================>

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import data from "./document.json"; // Import your JSON data

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const handleSearch = () => {
//     if (searchTerm.trim() !== "") {
//       onSearch(searchTerm);
//     }
//   };

//   const handleInputChange = (input) => {
//     setSearchTerm(input);
//     if (input.trim() !== "") {
//       const filteredSuggestions = data.filter((item) =>
//         item.symbol.toLowerCase().startsWith(input.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (selectedSymbol) => {
//     setSearchTerm(selectedSymbol);
//     setSuggestions([]);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "50px",
//       }}
//     >
//       <TextField
//         label="Company Symbol"
//         variant="outlined"
//         size="small"
//         value={searchTerm}
//         onChange={(e) => handleInputChange(e.target.value)}
//       />
//       <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
//         Search
//       </Button>
//       {suggestions.length > 0 && (
//         <Paper
//           elevation={3}
//           sx={{ width: "50%", mt: 2, maxHeight: 200, overflow: "auto" }}
//         >
//           <List>
//             {suggestions.map((item) => (
//               <ListItem
//                 key={item.id}
//                 button
//                 onClick={() => handleSuggestionClick(item.symbol)}
//               >
//                 <ListItemText primary={item.symbol} />
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default SearchBar;



//With ElasticSearch==============================================================================================>

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      // Fetching data from the elasticsearch index (Wildcard query should be implemented)
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic ZWxhc3RpYzoxdXBiMTlnaw==");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://elasticsearch-144080-0.cloudclusters.net:12269/stocks/_search?q=${searchTerm}*&size=100&from=0`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          // Extract and set the suggestions from the API response
          const suggestionData = data.hits.hits.map((hit) => ({
            id: hit._id,
            symbol: hit._source.symbol,
          }));
          setSuggestions(suggestionData);
        })
        .catch((error) => console.log("error", error));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm);
    }
  };

  const handleSuggestionClick = (selectedSymbol) => {
    setSearchTerm(selectedSymbol);
    setSuggestions([]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <TextField
        label="Company Symbol"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
        Search
      </Button>
      {suggestions.length > 0 && (
        <Paper
          elevation={3}
          sx={{ width: "50%", mt: 2, maxHeight: 200, overflow: "auto" }}
        >
          <List>
            {suggestions.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => handleSuggestionClick(item.symbol)}
              >
                <ListItemText primary={item.symbol} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;