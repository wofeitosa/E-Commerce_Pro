import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";

const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const {
    palette: { neutral },
  } = useTheme();

  // Verifica se o item é válido e possui attributes
  if (!item?.id || !item?.attributes) {
    console.error("Item inválido:", item);
    return null;
  }

  // Extrai os atributos do item
  const { name, price, category, image } = item.attributes;

  // Função auxiliar para obter a URL da imagem
  const getImageUrl = (image) => {
    if (!image) return null;
    // Se a imagem for uma string, já é a URL
    if (typeof image === "string") return image;
    // Se a imagem vier como objeto com data, tenta acessar a URL dentro de data.attributes
    if (image.data && image.data.attributes && image.data.attributes.url) {
      return image.data.attributes.url;
    }
    // Caso contrário, tenta acessar diretamente a propriedade url
    return image.url;
  };

  const imageUrl = getImageUrl(image);

  return (
    <Box width={width}>
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {imageUrl ? (
          <img
            alt={name}
            width="300px"
            height="400px"
            src={
              imageUrl.startsWith("http")
                ? imageUrl
                : `http://localhost:1337${imageUrl}`
            }
            onClick={() => navigate(`/item/${item.id}`)}
            style={{ cursor: "pointer", objectFit: "cover" }}
          />
        ) : (
          <Box
            width="300px"
            height="400px"
            bgcolor={neutral.light}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography>Nenhuma imagem disponível</Typography>
          </Box>
        )}

        <Box
          display={isHovered ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="100%"
          padding="0 25% 0 7%"
        >
          <Box display="flex" justifyContent="space-between">
            <Box
              display="flex"
              alignItems="center"
              backgroundColor={shades.neutral[100]}
              borderRadius="3px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
              sx={{
                backgroundColor: shades.primary[300],
                color: "white",
                "&:hover": { backgroundColor: shades.primary[400] },
              }}
            >
              ADD TO CART
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt="3px">
        <Typography variant="subtitle2" color={neutral.dark}>
          {category?.replace(/([A-Z])/g, " $1")?.replace(/^./, (str) => str.toUpperCase()) ||
            "Sem categoria"}
        </Typography>
        <Typography>{name || "Produto sem nome"}</Typography>
        <Typography fontWeight="bold">
          ${typeof price === "number" ? price.toFixed(2) : "0.00"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Item;
