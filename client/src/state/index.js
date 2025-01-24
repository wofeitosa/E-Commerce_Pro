import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  cart: [],
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const newItem = action.payload.item;
      // Se já existe no carrinho, apenas soma count
      const existingItem = state.cart.find((i) => i.id === newItem.id);
      if (existingItem) {
        existingItem.count += newItem.count;
      } else {
        state.cart.push({ ...newItem, count: newItem.count || 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },
    increaseCount: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload.id);
      if (item) {
        item.count++;
      }
    },
    decreaseCount: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload.id);
      if (item && item.count > 1) {
        item.count--;
      }
    },
    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  setItems,
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  setIsCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
