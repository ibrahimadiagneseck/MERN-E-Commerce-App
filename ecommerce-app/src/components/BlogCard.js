
import { Link } from "react-router-dom"; // Pour la navigation entre les pages


const BlogCard = (props) => {
    
    // Destructuration des props pour un accès plus facile
    const { id, title, description, date, image } = props;

    // Fonction helper pour gérer l'affichage sécurisé de la description
    // Cette fonction prépare le contenu HTML pour `dangerouslySetInnerHTML`
    const renderDescription = (description) => {
        // Cas 1 : Si la description est vide ou undefined
        if (!description) {
            // TOUJOURS retourner un objet avec __html, même vide
            return { __html: '' };
        }
        
        // Cas 2 : Si la description est déjà formatée pour dangerouslySetInnerHTML
        // C'est-à-dire si c'est un objet avec une propriété __html
        if (description && description.__html !== undefined) {
            return description;
        }
        
        // Cas 3 : Si la description est une chaîne de caractères
        if (typeof description === 'string') {
            // Tronque la description à 70 caractères pour préserver l'interface
            const truncatedDesc = description.length > 70 
                ? description.slice(0, 70) + "..." // Ajoute des points de suspension si tronquée
                : description; // Garde la description intacte si <= 70 caractères
            return { __html: truncatedDesc };
        }
        
        // Cas par défaut : sécurité supplémentaire
        return { __html: '' };
    };

    // Rendu du composant
    return (
        <div className="blog-card"> {/* Conteneur principal */}
            <div className="card-image"> {/* Conteneur de l'image */}
                {/* 
                  - `src={image}` : URL de l'image passée en prop
                  - `className="img-fluid"` : rend l'image responsive (Bootstrap)
                  - `className="w-100"` : force la largeur à 100% du conteneur
                  - `alt="blog"` : texte alternatif pour l'accessibilité
                */}
                <img src={image} className="img-fluid w-100" alt="blog"/>
            </div>
            <div className="blog-content"> {/* Conteneur du contenu texte */}
                {/* Date de publication */}
                <p className="date">{date}</p>
                
                {/* Titre de l'article */}
                <h5 className="title">{title}</h5>
                
                {/* 
                  Description de l'article avec dangerouslySetInnerHTML
                  ⚠️ ATTENTION : L'utilisation de dangerouslySetInnerHTML peut présenter 
                  des risques de sécurité XSS si le contenu n'est pas de confiance.
                  Ici, on le contrôle via notre fonction renderDescription.
                */}
                <p 
                    className="desc" 
                    dangerouslySetInnerHTML={renderDescription(description)}
                >
                    {/* 
                      Note : Le contenu est injecté via dangerouslySetInnerHTML,
                      donc rien n'est écrit entre les balises <p></p>
                    */}
                </p>
                
                <Link to={"/blog/" + id} className="button">
                    Read More
                </Link>
            </div>
        </div>
    )
};

export default BlogCard;