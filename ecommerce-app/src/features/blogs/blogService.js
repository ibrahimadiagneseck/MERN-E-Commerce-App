// features/user/userService.js
import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const getBlogs = async () => {
  const response = await axios.get(`${base_url}/blog`);
  if (response.data) {
    return response.data;
  }
};



export const blogService = {
  getBlogs,
  // addToWishlist,
};