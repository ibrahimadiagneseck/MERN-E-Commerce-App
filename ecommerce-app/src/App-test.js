import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components-test/Layout";
import Home from "./pages-test/Home";
import About from "./pages-test/About";
import Contact from "./pages-test/Contact";
import OurStore from "./pages-test/OurStore";
import Blog from "./pages-test/Blog";
import CompareProduct from "./pages-test/CompareProduct";
import Wishlist from "./pages-test/Wishlist";
import Login from "./pages-test/Login";
import Forgotpassword from "./pages-test/Forgotpassword";
import Signup from "./pages-test/Signup";
import Resetpassword from "./pages-test/Resetpassword";
import SingleBlog from "./pages-test/SingleBlog";
import PrivacyPolicy from "./pages-test/PrivacyPolicy";
import RefundPolicy from "./pages-test/RefundPolicy";
import ShippingPolicy from "./pages-test/ShippingPolicy";
import TermsAndCondition from "./pages-test/TermsAndConditions";
import SingleProduct from "./pages-test/SingleProduct";
import Cart from "./pages-test/Cart";
import Checkout from "./pages-test/Checkout";

// Déclaration du composant principal `App`.
function AppTest() {
  return (
    <>
      {/* Début du routeur pour gérer la navigation dans l'application. */}
      <Router>
        {/* `Routes` est un conteneur pour toutes les routes de l'application. */}
        <Routes>

          {/* Définition de la route principale ("/") avec `Layout` comme composant parent. */}
          <Route path="/" element={<Layout />}>
            {/* Utilisation de `index` pour rendre la route par défaut ("/") avec `Home` comme composant enfant de `Layout`. */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="products" element={<OurStore />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="blog/:id" element={<SingleBlog />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="compare-product" element={<CompareProduct />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="signup" element={<Signup />} />
            <Route path="reset-password" element={<Resetpassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="terms-conditions" element={<TermsAndCondition />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default AppTest;
