import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";

const Item = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const {
    palette: { neutral },
  } = useTheme();

  const { attributes } = item || {};
  const { category, price, name, image } = attributes || {};
  
  // Corrigindo o acesso à URL da imagem
  const imageUrl = image?.data?.attributes?.formats?.medium?.url || image?.data?.attributes?.url;

  if (!item || !attributes) return null;

  return (
    <Box width="100%">
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {imageUrl && (
          <img
            alt={name}
            width="300px"
            height="400px"
            src={`http://localhost:1337${imageUrl}`}
            onClick={() => navigate(`/item/${item.id}`)}
            style={{ cursor: "pointer", objectFit: "cover" }}
          />
        )}

        <Box
          display={isHovered ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="100%"
          padding="0 5%"
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
                "&:hover": { backgroundColor: shades.primary[400] }
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt="3px">
        <Typography variant="subtitle2" color={neutral.dark}>
          {category?.replace(/([A-Z])/g, " $1")?.replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight="bold">${price?.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export default Item; 