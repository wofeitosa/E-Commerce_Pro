import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    try {
      const response = await fetch("http://localhost:3000/api/items?populate=image", {
        method: "GET",
      });
      const data = await response.json();
      dispatch(setItems(data.data)); // Array de items (estrutura Strapi)
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
    }
  }

  useEffect(() => {
    getItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Se quiser garantir que nenhum item com atributos indefinidos quebre a página:
  const validItems = items.filter((item) => item?.attributes);

  const topRatedItems = validItems.filter(
    (item) => item?.attributes?.category === "topRated"
  );
  const newArrivalsItems = validItems.filter(
    (item) => item?.attributes?.category === "newArrivals"
  );
  const bestSellersItems = validItems.filter(
    (item) => item?.attributes?.category === "bestSellers"
  );

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>

      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
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
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === "all" &&
          validItems.map((item) => (
            <Item item={item} key={`${item.id}-${item.attributes?.name}`} />
          ))}
        {value === "newArrivals" &&
          newArrivalsItems.map((item) => (
            <Item item={item} key={`${item.id}-${item.attributes?.name}`} />
          ))}
        {value === "bestSellers" &&
          bestSellersItems.map((item) => (
            <Item item={item} key={`${item.id}-${item.attributes?.name}`} />
          ))}
        {value === "topRated" &&
          topRatedItems.map((item) => (
            <Item item={item} key={`${item.id}-${item.attributes?.name}`} />
          ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;