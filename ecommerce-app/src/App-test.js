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
            <Route path="store" element={<OurStore />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="compare-product" element={<CompareProduct />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default AppTest;
