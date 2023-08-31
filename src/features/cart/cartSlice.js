import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    lastAddedItem: null,
  },
  reducers: {
    addToCart(state, action) {
      const { product, quantity } = action.payload;
      state.lastAddedItem = product;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    resetLastAddedItem(state) {
      state.lastAddedItem = null;
    },
    increaseQuantity(state, action) {
      const productId = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === productId
      );
      if (existingItem) {
        existingItem.quantity++;
      }
    },
    decreaseQuantity(state, action) {
      const productId = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === productId
      );
      if (existingItem && existingItem.quantity >= 1) {
        existingItem.quantity--;

        if (existingItem.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          );
        }
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
    },
  },
});

export const {
  addToCart,
  resetLastAddedItem,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
