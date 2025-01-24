import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";
import { Box, Typography, CircularProgress, Alert, Tabs, Tab } from "@mui/material";
import Item from "../../components/Item";
import useMediaQuery from "@mui/material/useMediaQuery";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items || []);
  const [value, setValue] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isWideScreen = useMediaQuery("(min-width:600px)");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:1337/api/items?populate[image][fields][0]=url&populate[image][fields][1]=formats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos do Strapi:', data);
      dispatch(setItems(data.data));
    } catch (err) {
      console.error("Error fetching items:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filterItemsByCategory = (category) => {
    if (!items) return [];
    if (category === "all") return items;
    return items.filter((item) => item?.attributes?.category === category);
  };

  const filteredItems = filterItemsByCategory(value);

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center" marginBottom="20px">
        Our Featured <b>Products</b>
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" margin="20px">
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box display="flex" justifyContent="center" margin="20px">
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <>
          <Tabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            centered
            textColor="primary"
            indicatorColor="primary"
            TabIndicatorProps={{ sx: { display: isWideScreen ? "block" : "none" } }}
            sx={{
              marginBottom: "25px",
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap",
              },
            }}
          >
            <Tab label="ALL" value="all" />
            <Tab label="NEW ARRIVALS" value="newArrivals" />
            <Tab label="BEST SELLERS" value="bestSellers" />
            <Tab label="TOP RATED" value="topRated" />
          </Tabs>
          
          <Box
            margin="0 auto"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            justifyContent="space-around"
            rowGap="20px"
            columnGap="1.33%"
          >
            {filteredItems.map((item) => (
              <Item key={`${item.id}-${item.attributes?.name}`} item={item} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ShoppingList; 