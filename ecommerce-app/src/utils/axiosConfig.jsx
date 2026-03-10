// export const base_url = "http://localhost:5000/api";

// const getTokenFromLocalStorage = localStorage.getItem("customer")
//   ? JSON.parse(localStorage.getItem("customer"))
//   : null;

// export const config = {
//   headers: {
//     Authorization: `Bearer ${
//       getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
//     }`,
//     Accept: "application/json",
//   },
// };
 

// utils/axiosConfig.js
export const base_url = "http://localhost:5000/api";

// Fonction pour récupérer le token à jour
const getToken = () => {
  const customer = localStorage.getItem("customer");
  if (customer) {
    try {
      const parsedCustomer = JSON.parse(customer);
      return parsedCustomer.token || "";
    } catch (e) {
      console.error("Error parsing customer from localStorage:", e);
      return "";
    }
  }
  return "";
};

// Fonction qui retourne une nouvelle config à chaque appel
export const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Pour compatibilité avec le code existant, vous pouvez garder une version par défaut
// mais il vaut mieux utiliser getConfig() partout
export const config = getConfig(); // ⚠️ Ceci reste statique - À ÉVITER