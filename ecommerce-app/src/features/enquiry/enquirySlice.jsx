import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { enquiryService } from "./enquiryService";

export const createQuery = createAsyncThunk(
  "enquiry/post",
  async (enquiryData, thunkAPI) => {
    try {
      const response = await enquiryService.postQuery(enquiryData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit enquiry";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const enquiryState = {
  enquiry: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const enquirySlice = createSlice({
  name: "enquiry",
  initialState: enquiryState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.enquiry = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuery.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.enquiry = action.payload;
        state.message = "Enquiry submitted successfully!";
      })
      .addCase(createQuery.rejected, (state, action) => {
        state.isLoading = false; 
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  }
});

export const { resetState } = enquirySlice.actions;
export default enquirySlice.reducer;