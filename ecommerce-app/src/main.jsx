// Import de React - nécessaire pour utiliser JSX
import React from "react";

// Import de ReactDOM - permet de rendre l'application dans le navigateur
import ReactDOM from "react-dom/client";

// Import de notre composant principal App
import App from "./App.jsx";

// Import de Provider de Redux - pour connecter Redux à React
import { Provider } from "react-redux";

// Import de notre store Redux (où sont gérés les états globaux)
import { store } from "./app/store";

// Import de HelmetProvider de react-helmet-async - pour gérer les balises <head> (titres, meta descriptions)
import { HelmetProvider } from "react-helmet-async";

// Import du fichier CSS principal de l'application
import "./App.css";

// ----------------------------- EXPLICATION -----------------------------
// ReactDOM.createRoot : Crée un point d'entrée pour React dans la page HTML
// document.getElementById("root") : Cherche l'élément HTML avec l'id "root" (dans index.html)
// C'est là que toute notre application React sera injectée
const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render() : Dit à React quoi afficher dans le root
// C'est le point de départ de toute l'application
root.render(
  // React.StrictMode : Mode strict de React - aide à détecter les problèmes potentiels
  // (ne rend rien visuellement, juste des avertissements dans la console)
  <React.StrictMode>
    
    {/* HelmetProvider : Permet de modifier les balises <head> du document HTML
        (ex: changer le titre de l'onglet, ajouter des meta tags pour le SEO)
        Sans ça, on ne peut pas utiliser <Helmet> dans les composants */}
    <HelmetProvider>
      
      {/* Provider : Composant de Redux qui rend le store accessible à TOUS les composants
          Sans ça, les composants ne peuvent pas accéder au state Redux */}
      <Provider store={store}>
        
        {/* App : Notre composant principal qui contient toutes les routes de l'application */}
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

// ----------------------------- RÉSUMÉ -----------------------------
// 1. On récupère la div "root" dans index.html
// 2. On dit à React de contrôler cette div
// 3. On met en place tous les "contextes" nécessaires :
//    - StrictMode : vérifications supplémentaires
//    - HelmetProvider : pour gérer les balises <head>
//    - Provider : pour Redux
// 4. On lance notre application avec <App />