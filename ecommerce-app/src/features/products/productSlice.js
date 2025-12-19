// features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "./userService";
// import { toast } from "react-toastify";
import { productService } from "./productService";



export const getAllProducts = createAsyncThunk(
  "product/get",
  async (thunkAPI) => {
    try {
      const response = await productService.getProducts();
      return response;
    } catch (error) {
      // Correction: Changer "Registration failed" par "Login failed"
      const message =
        error.response?.data?.message ||
        error.message ||
        "failed"; 

      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const addToWishlist = createAsyncThunk(
  "product/wishlist",
  async (prodId, thunkAPI) => {
    try {
      const response = await productService.addToWishlist(prodId);
      return response;
    } catch (error) {
      // Correction: Changer "Registration failed" par "Login failed"
      const message =
        error.response?.data?.message ||
        error.message ||
        "failed"; 

      return thunkAPI.rejectWithValue(message);
    }
  }
);


const productState = {
  product: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.addToWishlist = action.payload;
        state.message = "Product Added To wishlist !";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
  }
});

// export const { resetState, logout } = authSlice.actions;
export default productSlice.reducer;