// features/user/userService.js
import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig"; // Changez ici

const register = async (userData) => {
  const response = await axios.post(`${base_url}/user/register`, userData);
  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
    return response.data;
  }
};

const login = async (userData) => {
  const response = await axios.post(`${base_url}/user/login`, userData);
  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
    return response.data;
  }
};

const getUserWishlist = async () => {
  const response = await axios.get(`${base_url}/user/wishlist`, getConfig()); // 👈 Utilisez getConfig()
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await axios.post(`${base_url}/user/cart`, cartData, getConfig()); // 👈
  if (response.data) {
    return response.data;
  }
};

// const getCart = async () => {
//   console.log("🔍 getCart - Token actuel:", getConfig().headers.Authorization); // Log pour debug
//   const response = await axios.get(`${base_url}/user/cart`, getConfig()); // 👈
//   if (response.data) {
//     return response.data;
//   }
// };

const getCart = async () => {
  // console.log("📤 FRONTEND - Appel GET /cart");
  // console.log("Config utilisée:", getConfig());
  // console.log("Token dans config:", getConfig().headers.Authorization);
  
  try {
    const response = await axios.get(`${base_url}/user/cart`, getConfig());
    // console.log("✅ Réponse reçue:", response.status, response.data);
    return response.data;
  } catch (error) {
    // console.error("❌ Erreur dans getCart:", error.response?.status, error.response?.data);
    throw error;
  }
};

const emptyCart = async () => {
  const response = await axios.delete(`${base_url}/user/empty-cart`, getConfig()); // 👈
  if (response.data) {
    return response.data;
  }
};

const removeProductFromCart = async (data) => {
  const response = await axios.delete(`${base_url}/user/remove-product-cart`, { 
    data: data,
    ...getConfig() // 👈
  });
  if (response.data) {
    return response.data;
  }
};

const updateProductQuantity = async (data) => {
  const response = await axios.put(`${base_url}/user/update-quantity-cart`, data, getConfig()); // 👈
  if (response.data) {
    return response.data;
  }
};


// ==================== ORDER ====================

const createOrder = async (orderData) => {
  console.log("📤 FRONTEND - Appel POST /order/create", orderData);
  try {
    const response = await axios.post(
      `${base_url}/user/order/create`,
      orderData,
      getConfig()
    );
    console.log("✅ Réponse reçue:", response.status, response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur dans createOrder:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

export const authService = {
  register,
  login,
  getUserWishlist,
  addToCart,
  getCart,
  emptyCart,
  removeProductFromCart,
  updateProductQuantity,
  createOrder
};