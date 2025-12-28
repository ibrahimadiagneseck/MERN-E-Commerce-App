// features/user/userService.js
import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

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
  const response = await axios.get(`${base_url}/user/wishlist`, config);
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await axios.post(`${base_url}/user/cart`, cartData, config);
  if (response.data) {
    return response.data;
  }
};

const getCart = async () => {
  const response = await axios.get(`${base_url}/user/cart`, config);
  if (response.data) {
    return response.data;
  }
};

// Nouvelle fonction pour vider le panier
const emptyCart = async () => {
  const response = await axios.delete(`${base_url}/user/empty-cart`, config);
  if (response.data) {
    return response.data;
  }
};

// Nouvelle fonction pour supprimer un produit du panier
const removeProductFromCart = async (data) => {
  const response = await axios.delete(`${base_url}/user/remove-product-cart`, { 
    data: data, // Passer les données dans le body
    headers: config.headers 
  });
  if (response.data) {
    return response.data;
  }
};

// Nouvelle fonction pour mettre à jour la quantité
const updateProductQuantity = async (data) => {
  const response = await axios.put(`${base_url}/user/update-quantity-cart`, data, config);
  if (response.data) {
    return response.data;
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
  updateProductQuantity
};