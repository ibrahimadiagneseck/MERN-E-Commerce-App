import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import ProductCard from "../components/ProductCard";
import ReactStars from "react-rating-stars-component";
import { useEffect, useState } from "react";
import ReactImageZoom from "react-image-zoom";
import Color from "../components/Color";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import StarRating from "../components-others/StarRating";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../features/products/productSlice";
import { toast } from "react-toastify";
import watchImage from "../images/watch.jpg";
import { addProdToCart, getUserCart } from "../features/user/userSlice";

const SingleProduct = () => {
    const navigate = useNavigate();

    // ============================================
    // 1. RÉCUPÉRATION DES PARAMÈTRES DE L'URL
    // ============================================
    const { id: productId } = useParams();

    // ============================================
    // 2. ÉTATS LOCAUX (useState)
    // ============================================
    const [colorProd, setColor] = useState(null);
    const [quantityProd, setQuantity] = useState(1);
    const [alreadyAdded, setAlreadyAdded] = useState(false);

    // ============================================
    // 3. RÉCUPÉRATION DES DONNÉES DEPUIS REDUX
    // ============================================
    const productState = useSelector((state) => state?.product?.product);
    const userCartState = useSelector((state) => state?.auth?.cartProducts);

    // ============================================
    // 4. NETTOYAGE ET FORMATAGE DES DONNÉES
    // ============================================
    const product = productState && typeof productState === "object" ? productState : null;
    const availableQuantity = product?.quantity || 0;
    
    // Calcul de la note moyenne du produit
    const ratingValue = product?.totalrating
        ? typeof product.totalrating === "string"
            ? parseFloat(product.totalrating)
            : Number(product.totalrating)
        : 0;

    // ============================================
    // 5. INITIALISATION DE DISPATCH
    // ============================================
    const dispatch = useDispatch();

    // ============================================
    // 6. CHARGEMENT INITIAL DES DONNÉES (useEffect 1)
    // ============================================
    useEffect(() => {
        const getProductDetails = (id) => {
            dispatch(getProduct(id));
        };

        const getCart = () => {
            dispatch(getUserCart());
        };

        getProductDetails(productId);
        getCart();
    }, [dispatch, productId]);

    // ============================================
    // 7. VÉRIFICATION "PRODUIT DÉJÀ DANS LE PANIER" (useEffect 2)
    // ============================================
    useEffect(() => {
        if (!userCartState || !productId) {
            setAlreadyAdded(false);
            return;
        }

        // Accéder au tableau products à l'intérieur de userCartState
        const cartProducts = userCartState?.products || [];

        if (!Array.isArray(cartProducts)) {
            setAlreadyAdded(false);
            return;
        }

        // Recherche du produit dans le panier
        const productExists = cartProducts.some((cartItem) => {
            if (!cartItem || !cartItem.product) {
                return false;
            }

            // Comparer l'ID du produit dans le panier avec l'ID actuel
            return cartItem.product._id === productId;
        });

        setAlreadyAdded(productExists);
    }, [userCartState, productId]);

    // ============================================
    // 8. FONCTION : AJOUTER AU PANIER
    // ============================================
    const uploadCart = async () => {
    // Validations...
    if (!product) {
        toast.error("Product not loaded");
        return;
    }
    if (availableQuantity <= 0) {
        toast.error("Product is out of stock");
        return;
    }
    if (colorProd === null) {
        toast.error("Please Choose Color");
        return;
    }
    if (quantityProd < 1) {
        toast.error("Quantity must be at least 1");
        return;
    }
    if (quantityProd > availableQuantity) {
        toast.error(`Only ${availableQuantity} units available`);
        return;
    }

    const cartData = {
        productId: productId,
        color: colorProd,
        price: product.price,
        quantity: Number(quantityProd),
    };

    try {
        // Attendre que l'ajout au panier soit terminé
        const result = await dispatch(addProdToCart(cartData));
        
        // Vérifier si l'ajout a réussi
        if (result.payload && result.payload.success) {
            // Recharger le panier après l'ajout
            await dispatch(getUserCart());
            
            // Afficher un message de succès
            toast.success("Product added to cart!");
            
            // Naviguer vers le panier
            navigate('/cart');
        } else {
            toast.error("Failed to add product to cart");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("An error occurred while adding to cart");
    }
};

    // ============================================
    // 9. FONCTION : RÉCUPÉRER L'URL D'UNE IMAGE
    // ============================================
    const getImageUrl = (item, index) => {
        // Si l'item n'a pas d'images ou que ce n'est pas un tableau, retourner l'image par défaut
        if (!item?.images || !Array.isArray(item.images)) {
            return watchImage;
        }

        // Si l'index existe dans le tableau d'images
        if (item.images.length > index) {
            const image = item.images[index];

            // Si l'image a une propriété url
            if (image?.url) {
                return image.url;
            }

            // Si l'image est une chaîne de caractères
            if (typeof image === "string") {
                return image;
            }
        }

        // Image par défaut si aucun cas n'est satisfait
        return watchImage;
    };

    // ============================================
    // 10. CONFIGURATION DU ZOOM D'IMAGE
    // ============================================
    const props = {
        width: 400,
        height: 600,
        zoomWidth: 600,
        img: getImageUrl(product, 0) || watchImage,
    };

    // ============================================
    // 11. FONCTION : COPIER LE LIEN DANS LE PRESSE-PAPIERS
    // ============================================
    const copyToClipboard = async (text) => {
        // Méthode moderne avec l'API Clipboard
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                toast.success("Product link copied to clipboard!");
            } catch (err) {
                fallbackCopy(text);
            }
        } else {
            // Méthode de secours pour les anciens navigateurs
            fallbackCopy(text);
        }
    };

    const fallbackCopy = (text) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            toast.info("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy the link.");
        }
    };

    // ============================================
    // 12. FONCTIONS POUR LES BOUTONS SECONDAIRES
    // ============================================
    const handleAddToCompare = (e) => {
        e.preventDefault();
        console.log("Add to compare clicked");
        // TODO: Implémenter la logique d'ajout à la comparaison
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        console.log("Add to wishlist clicked");
        // TODO: Implémenter la logique d'ajout à la liste de souhaits
    };

    const handleWriteReview = (e) => {
        e.preventDefault();
        console.log("Write review clicked");
        // TODO: Implémenter la logique d'écriture de commentaire
    };

    // ============================================
    // 13. RENDU DE L'INTERFACE (JSX)
    // ============================================
    return (
        <>
            {/* Meta tags pour le SEO */}
            <Meta title={"Product Name"} />
            
            {/* Fil d'Ariane pour la navigation */}
            <BreadCrumb title="Product Name" />

            {/* Section principale du produit */}
            <Container class1="main-product-wrapper py-5 home-wrapper-2">
                <div className="row">
                    {/* Colonne gauche : Images du produit */}
                    <div className="col-6">
                        <div className="main-product-image">
                            <div>
                                {/* Zoom sur l'image principale */}
                                <ReactImageZoom {...props} />
                            </div>
                        </div>

                        {/* Galerie d'images secondaires */}
                        <div className="other-product-images d-flex flex-wrap gap-15">
                            {product?.images && product.images.length > 0 ? (
                                // Affichage des images du produit
                                product.images.map((_, index) => (
                                    <div key={index}>
                                        <img
                                            src={getImageUrl(product, index)}
                                            className="img-fluid"
                                            alt={`product-${index}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                // Image par défaut si aucune image disponible
                                <div>
                                    <img
                                        src={watchImage}
                                        className="img-fluid"
                                        alt="default-product"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Colonne droite : Détails du produit */}
                    <div className="col-6">
                        <div className="main-product-details">
                            {/* Titre du produit */}
                            <div className="border-bottom">
                                <h3 className="title">{product?.title}</h3>
                            </div>

                            {/* Prix et évaluations */}
                            <div className="border-bottom py-3">
                                <p className="price">$ {product?.price}</p>
                                <div className="d-flex align-items-center gap-10">
                                    {/* Composant d'étoiles personnalisé */}
                                    <StarRating
                                        isHalf={true}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        filledIcon={<i className="fa fa-star"></i>}
                                        a11y={true}
                                        char="★"
                                        color="gray"
                                        value={ratingValue}
                                    />
                                    <p className="mb-0 t-review">( 2 Reviews )</p>
                                </div>
                                {/* Bouton pour écrire un avis */}
                                <button
                                    className="review-btn border-0 bg-transparent text-decoration-underline p-0"
                                    onClick={() =>
                                        document
                                            .getElementById("review")
                                            .scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    Write a Review
                                </button>
                            </div>

                            {/* Informations détaillées du produit */}
                            <div className="py-3">
                                {/* Type */}
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Type :</h3>
                                    <p className="product-data">Match</p>
                                </div>

                                {/* Marque */}
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Brand :</h3>
                                    <p className="product-data">{product?.brand}</p>
                                </div>

                                {/* Catégorie */}
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Category :</h3>
                                    <p className="product-data">{product?.category}</p>
                                </div>

                                {/* Tags */}
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Tags :</h3>
                                    <p className="product-data">{product?.tags?.join(", ")}</p>
                                </div>

                                {/* Disponibilité */}
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Availability :</h3>
                                    <p className="product-data">
                                        {product?.quantity > 0 ? "In Stock" : "Out of Stock"} ({availableQuantity})
                                    </p>
                                </div>

                                {/* Tailles */}
                                <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                    <h3 className="product-heading">Size :</h3>
                                    <div className="d-flex flex-wrap gap-15">
                                        <span className="badge border border-1 bg-white text-dark border-secondary">
                                            S
                                        </span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">
                                            M
                                        </span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">
                                            XL
                                        </span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">
                                            XXL
                                        </span>
                                    </div>
                                </div>

                                {/* Sélection de couleur (uniquement si non déjà dans le panier) */}
                                {alreadyAdded === false && (
                                    <>
                                        <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                            <h3 className="product-heading">Color :</h3>
                                            <Color setColor={setColor} colorData={product?.color} />
                                        </div>
                                    </>
                                )}

                                {/* Contrôles d'achat */}
                                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                                    {alreadyAdded === false && (
                                        <>
                                            {/* Sélection de quantité */}
                                            <h3 className="product-heading">Quantity :</h3>
                                            <CustomInput
                                                type="number"
                                                label="Quantity"
                                                i_id="quantity"
                                                i_class=""
                                                name="quantity"
                                                min={1}
                                                max={availableQuantity}
                                                onChng={(e) => {
                                                    const value = Math.min(
                                                        Math.max(1, parseInt(e.target.value) || 1),
                                                        availableQuantity
                                                    );
                                                    setQuantity(value);
                                                }}
                                                onBlr={() => { }}
                                                val={quantityProd}
                                                style={{ width: "70px" }}
                                                disabled={availableQuantity <= 0}
                                            />
                                        </>
                                    )}

                                    {/* Bouton principal (Add to Cart / Go To Cart) */}
                                    <div className={alreadyAdded ? "ms-0" : "d-flex align-items-center gap-30 ms-5"}>
                                        {alreadyAdded ? (
                                            // Bouton "Go To Cart" - toujours actif
                                            <button
                                                className="button border-0"
                                                type="button"
                                                onClick={() => navigate('/cart')}
                                            >
                                                Go To Cart
                                            </button>
                                        ) : (
                                            // Bouton "Add to Cart" avec conditions de désactivation
                                            // disabled={!product || !colorProd || quantityProd < 1 || availableQuantity <= 0}
                                            <button
                                                className="button border-0"
                                                type="button"
                                                onClick={uploadCart}
                                                style={{
                                                    opacity: (!product || !colorProd || quantityProd < 1 || availableQuantity <= 0) ? 0.5 : 1,
                                                    cursor: (!product || !colorProd || quantityProd < 1 || availableQuantity <= 0) ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Informations sur la disponibilité */}
                                {availableQuantity <= 0 && alreadyAdded === false && (
                                    <p className="text-danger small mt-1 mb-3">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        Product out of stock
                                    </p>
                                )}

                                {availableQuantity > 0 && alreadyAdded === false && (
                                    <p className="text-success small mt-1 mb-3">
                                        <i className="fas fa-check-circle me-2"></i>
                                        {availableQuantity} units available
                                    </p>
                                )}

                                {/* Boutons secondaires (comparaison et liste de souhaits) */}
                                <div className="d-flex align-items-center gap-15">
                                    <div>
                                        <button
                                            className="border-0 bg-transparent p-0 d-flex align-items-center"
                                            onClick={handleAddToCompare}
                                        >
                                            <TbGitCompare className="fs-5 me-2" /> Add to Compare
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="border-0 bg-transparent p-0 d-flex align-items-center"
                                            onClick={handleAddToWishlist}
                                        >
                                            <AiOutlineHeart className="fs-5 me-2" /> Add to Wishlist
                                        </button>
                                    </div>
                                </div>

                                {/* Informations de livraison */}
                                <div className="d-flex gap-10 flex-column my-3">
                                    <h3 className="product-heading">Shipping & Returns :</h3>
                                    <p className="product-data">
                                        Free shipping and returns available on all orders! <br />
                                        We ship all US domestic orders within{" "}
                                        <b>5-10 business days!</b>
                                    </p>
                                </div>

                                {/* Copier le lien du produit */}
                                <div className="d-flex gap-10 align-items-center my-3">
                                    <h3 className="product-heading">Product Link:</h3>
                                    <button
                                        className="border-0 bg-transparent text-decoration-underline p-0"
                                        onClick={() => {
                                            copyToClipboard(window.location.href);
                                        }}
                                    >
                                        Copy Product Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Section description du produit */}
            <Container class1="description-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <h4>Description</h4>
                        <div className="bg-white p-3">
                            {/* Utilisation de dangerouslySetInnerHTML pour afficher le HTML */}
                            <p
                                className="desc"
                                dangerouslySetInnerHTML={{
                                    __html: product?.description || "",
                                }}
                            ></p>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Section des avis */}
            <Container class1="reviews-wrapper home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <h3 id="review">Reviews</h3>
                        <div className="review-inner-wrapper">
                            {/* En-tête des avis */}
                            <div className="review-head d-flex justify-content-between align-items-end">
                                <div>
                                    <h4 className="mb-2">Customer Reviews</h4>
                                    <div className="d-flex align-items-center gap-10">
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={4}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <p className="mb-0">Based on 2 Reviews</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="text-dark text-decoration-underline border-0 bg-transparent p-0"
                                        onClick={handleWriteReview}
                                    >
                                        Write a Review
                                    </button>
                                </div>
                            </div>

                            {/* Formulaire d'avis */}
                            <div className="review-form py-4">
                                <h4>Write a Reviews</h4>
                                <form className="d-flex flex-column gap-15">
                                    <div>
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={0}
                                            edit={true}
                                            activeColor="#ffd700"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            className="w-100 form-control"
                                            cols="30"
                                            rows="4"
                                            placeholder="Comments"
                                        ></textarea>
                                    </div>
                                    <div className="d-flew justify-content-end">
                                        <button className="button border-0">Submit Review</button>
                                    </div>
                                </form>
                            </div>

                            {/* Liste des avis existants */}
                            <div className="reviews mt-3">
                                <div className="review">
                                    <div className="d-flex gap-10 align-items-center">
                                        <h6 className="mb-0">Navdeep</h6>
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={4}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                    </div>
                                    <p className="mt-3">
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                        Tenetur nisi similique illum aut perferendis voluptas,
                                        quisquam obcaecati qui nobis officia. Voluptatibus in harum
                                        deleniti labore maxime officia esse eos? Repellat?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Section produits populaires */}
            <Container class1="popular-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <ProductCard />
                </div>
            </Container>
        </>
    );
};

export default SingleProduct;