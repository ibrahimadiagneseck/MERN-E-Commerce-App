// import { react } from "react";

// `Outlet` est un espace réservé qui rendra les composants enfants dans le layout.
import { Outlet } from "react-router-dom";
// `Header` peut contenir des éléments de navigation, un logo, etc.
import Header from "./Header";
// `Footer` peut contenir des informations de contact, liens, copyright, etc.
import Footer from "./Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Déclaration du composant `Layout`, qui définit la structure générale de la page.
const Layout = () => {
    
    // `return` utilise des parenthèses pour retourner du JSX. : Ce JSX définit la structure visuelle du layout.
    return (
        <>
            {/* Affiche le composant `Header` en haut de la page */}
            <Header/>

            {/* `Outlet` rendra le contenu enfant (par exemple, la page `Home` ou tout autre composant qui est route enfant du Layout) */}
            <Outlet/>

            {/* Affiche le composant `Footer` en bas de la page */}
            <Footer/>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
        </>
    );
};

// Exporte le composant `Layout` pour pouvoir l'utiliser dans d'autres fichiers.
export default Layout;
