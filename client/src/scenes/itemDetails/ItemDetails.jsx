import { Box, Button, IconButton, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Item from "../../components/Item";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";
import { addToCart } from "../../state";
import { useDispatch } from "react-redux";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  // Função para alterar a aba
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Função para transformar o objeto bruto (raw) retornado pelo Strapi
  // para o formato esperado (com a propriedade "attributes")
  const transformItem = (rawItem) => {
    if (!rawItem) return null;
    return {
      id: rawItem.id,
      attributes: {
        name: rawItem.name,
        price: rawItem.price || 0,
        category: rawItem.category,
        shortDescription: rawItem.shortDescription,
        longDescription: rawItem.longDescription,
        image: rawItem.image
      }
    };
  };

  // Função para buscar o item específico usando o itemId
  const getItem = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/items/${itemId}?populate=*`,
        { method: "GET" }
      );
      const itemJson = await response.json();
      // Transforma o item bruto para o formato esperado
      const processedItem = transformItem(itemJson.data);
      setItem(processedItem);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  }, [itemId]);

  // Função para buscar os itens relacionados
  const getItems = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:1337/api/items?populate=*",
        { method: "GET" }
      );
      const itemsJson = await response.json();
      const validItems = itemsJson.data
        .map(transformItem)
        .filter(Boolean);
      setItems(validItems);
    } catch (error) {
      console.error("Error fetching related items:", error);
    }
  }, []);

  useEffect(() => {
    getItem();
    getItems();
  }, [getItem, getItems]);

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* IMAGEM DO ITEM */}
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.attributes?.name}
            width="100%"
            height="100%"
            src={
              item?.attributes?.image?.data?.attributes?.formats?.medium?.url
                ? `http://localhost:1337${item.attributes.image.data.attributes.formats.medium.url}`
                : "/no-image.png"
            }
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* DETALHES E AÇÕES */}
        <Box flex="1 1 50%" mb="40px">
          <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>

          <Box m="65px 0 25px 0">
            <Typography variant="h3">
              {item?.attributes?.name || "Produto sem nome"}
            </Typography>
            <Typography>
              $
              {typeof item?.attributes?.price === "number"
                ? item.attributes.price.toFixed(2)
                : "0.00"}
            </Typography>
            <Typography sx={{ mt: "20px" }}>
              {item?.attributes?.longDescription || "Sem descrição"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[300]}`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 0))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              sx={{
                backgroundColor: "#222222",
                color: "white",
                borderRadius: 0,
                minWidth: "150px",
                padding: "10px 40px",
              }}
              onClick={() =>
                dispatch(addToCart({ item: { ...item, count } }))
              }
            >
              ADD TO CART
            </Button>
          </Box>
          <Box>
            <Box m="20px 0 5px 0" display="flex">
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
            </Box>
            <Typography>
              CATEGORIES: {item?.attributes?.category || "Sem categoria"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ABA DE INFORMAÇÕES */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="DESCRIPTION" value="description" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <div>{item?.attributes?.longDescription}</div>
        )}
        {value === "reviews" && <div>reviews</div>}
      </Box>

      {/* ITENS RELACIONADOS */}
      <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Products
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(0, 5).map((relatedItem, i) => (
            <Item key={`${relatedItem.id}-${i}`} item={relatedItem} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
