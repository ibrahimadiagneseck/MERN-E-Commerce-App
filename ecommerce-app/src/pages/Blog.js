import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components-others/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import watchImage from "../images/watch.jpg"; // Image de secours
import moment from "moment"; // Pour formater les dates

// Composant principal de la page Blog
const Blog = () => {
    
    // Récupération des blogs depuis le store Redux
    // `useSelector` permet d'accéder à l'état global
    // `state?.blog?.blog` : navigation optionnelle pour éviter les erreurs si la structure n'existe pas
    const blogState = useSelector((state) => state?.blog?.blog);
    
    // `useDispatch` permet d'envoyer des actions Redux
    const dispatch = useDispatch();

    // `useEffect` pour exécuter du code après le rendu du composant
    // Ici, on charge les blogs au montage du composant
    useEffect(() => {
        const getBlogs = () => {
            // Dispatch de l'action qui va déclencher la récupération des blogs
            dispatch(getAllBlogs());
        };
        getBlogs();
    }, [dispatch]); // Dépendance : se ré-exécute si `dispatch` change (rare)

    // Sécurité : vérifie que blogState est bien un tableau avant d'utiliser `map`
    // Si blogState est undefined ou non-tableau, on utilise un tableau vide
    const blogs = blogState && Array.isArray(blogState) ? blogState : [];

    // Fonction utilitaire pour obtenir l'URL d'une image de manière sécurisée
    const getImageUrl = (item, index) => {
        // Vérification que l'article a bien un tableau d'images
        if (!item?.images || !Array.isArray(item.images)) {
            // Retourne une image par défaut si pas d'images disponibles
            return index === 0 ? watchImage : watchImage;
        }
        
        // Si l'image à l'index demandé existe
        if (item.images.length > index) {
            // Cas 1 : l'image est un objet avec une propriété `url`
            if (item.images[index]?.url) {
                return item.images[index].url;
            }
            // Cas 2 : l'image est directement une string (URL)
            if (typeof item.images[index] === 'string') {
                return item.images[index];
            }
        }
        
        // Fallback : image par défaut si tout échoue
        return index === 0 ? watchImage : watchImage;
    };

    // Rendu du composant
    return (
        <>
            {/* Meta tags pour le SEO */}
            <Meta title={"Blogs"} />
            
            {/* Composant fil d'Ariane (breadcrumb) */}
            <BreadCrumb title="Blogs" />
            
            {/* Conteneur principal avec classes de style */}
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                <div className="row">
                    {/* Colonne de gauche : filtres par catégorie */}
                    <div className="col-3">
                        <div className="filter-card mb-3">
                            <h3 className="filter-title">Find By Categories</h3>
                            <div>
                                {/* Liste des catégories (statique pour l'instant) */}
                                <ul className="ps-0">
                                    <li>Watch</li>
                                    <li>Tv</li>
                                    <li>Camera</li>
                                    <li>Laptop</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonne de droite : liste des articles de blog */}
                    <div className="col-9">
                        <div className="row">
                            {/* Boucle sur les blogs pour afficher chaque article */}
                            {
                                blogs?.map((item, index) => {
                                    return (
                                        // Chaque article occupe 6 colonnes sur 12 (soit la moitié de la largeur)
                                        <div className="col-6 mb-3" key={index}>
                                            {/* Composant carte d'article de blog */}
                                            <BlogCard 
                                                id={item?._id} // ID de l'article (pour navigation)
                                                title={item?.title} // Titre de l'article
                                                description={item?.description} // Description/texte de l'article
                                                image={getImageUrl(item, 0)} // Première image de l'article
                                                // Formatage de la date avec moment.js
                                                date={moment(item?.createdAt).format("MMMM Do YYYY, h:mm a")} 
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Blog;