// features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "./userService";
// import { toast } from "react-toastify";
import { blogService } from "./blogService";



export const getAllBlogs = createAsyncThunk(
  "blogs/get",
  async (thunkAPI) => {
    try {
      const response = await blogService.getBlogs();
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


export const getBlog = createAsyncThunk(
  "blog/get",
  async (id, thunkAPI) => {
    try {
      const response = await blogService.getBlog(id);
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



const blogState = {
  blog: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState: blogState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blog = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleBlog = action.payload;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = action.error;
      });
  }
});

export default blogSlice.reducer;