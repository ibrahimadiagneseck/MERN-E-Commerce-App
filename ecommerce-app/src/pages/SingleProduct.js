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
    console.log(availableQuantity);
    

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
    // 7. VÉRIFICATION "PRODUIT DÉJÀ DANS LE PANIER" (useEffect 2 - CORRIGÉ)
    // ============================================
    useEffect(() => {
        // CORRECTION: userCartState est un objet, pas un tableau directement
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
            // Vérifier si cartItem existe et a une propriété product
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
    const uploadCart = () => {
        
        if (!product) {
            toast.error("Product not loaded");
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

        // CORRECTION: Préparer les données selon la structure de votre API
        const cartData = {
            productId: productId,
            color: colorProd,
            price: product.price, // Inclure le prix
            quantity: Number(quantityProd),
            // Note: Votre API pourrait avoir besoin d'autres champs
        };

        dispatch(addProdToCart(cartData));
        navigate('/cart');
    };

    // ============================================
    // 9. FONCTION : RÉCUPÉRER L'URL D'UNE IMAGE
    // ============================================
    const getImageUrl = (item, index) => {
        if (!item?.images || !Array.isArray(item.images)) {
            return watchImage;
        }

        if (item.images.length > index) {
            const image = item.images[index];

            if (image?.url) {
                return image.url;
            }

            if (typeof image === "string") {
                return image;
            }
        }

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
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                toast.success("Product link copied to clipboard!");
            } catch (err) {
                fallbackCopy(text);
            }
        } else {
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
    // 12. FONCTIONS POUR LES BOUTONS
    // ============================================
    const handleAddToCompare = (e) => {
        e.preventDefault();
        console.log("Add to compare clicked");
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        console.log("Add to wishlist clicked");
    };

    const handleWriteReview = (e) => {
        e.preventDefault();
        console.log("Write review clicked");
    };

    // Fonction pour gérer le clic sur le bouton principal
    // const handleMainButtonClick = () => {
    //     if (alreadyAdded) {
    //         navigate('/cart');
    //     } else {
    //         uploadCart();
    //     }
    // };

    // ============================================
    // 13. RENDU DE L'INTERFACE (JSX)
    // ============================================
    return (
        <>
            <Meta title={"Product Name"} />
            <BreadCrumb title="Product Name" />

            <Container class1="main-product-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-6">
                        <div className="main-product-image">
                            <div>
                                <ReactImageZoom {...props} />
                            </div>
                        </div>

                        <div className="other-product-images d-flex flex-wrap gap-15">
                            {product?.images && product.images.length > 0 ? (
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

                    <div className="col-6">
                        <div className="main-product-details">
                            <div className="border-bottom">
                                <h3 className="title">{product?.title}</h3>
                            </div>

                            <div className="border-bottom py-3">
                                <p className="price">$ {product?.price}</p>
                                <div className="d-flex align-items-center gap-10">
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

                            <div className="py-3">
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Type :</h3>
                                    <p className="product-data">Match</p>
                                </div>

                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Brand :</h3>
                                    <p className="product-data">{product?.brand}</p>
                                </div>

                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Category :</h3>
                                    <p className="product-data">{product?.category}</p>
                                </div>

                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Tags :</h3>
                                    <p className="product-data">{product?.tags?.join(", ")}</p>
                                </div>

                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Availability :</h3>
                                    <p className="product-data">
                                        {product?.quantity > 0 ? "In Stock" : "Out of Stock"} ({availableQuantity}) 
                                    </p>
                                </div>

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

                                {
                                    alreadyAdded === false && <>
                                        <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                            <h3 className="product-heading">Color :</h3>
                                            <Color setColor={setColor} colorData={product?.color} />
                                        </div>
                                    </>
                                }

                                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                                    {
                                        alreadyAdded === false && <>

                                            <h3 className="product-heading">Quantity :</h3>
                                            <CustomInput
                                                type="number"
                                                label="Quantity"
                                                i_id="quantity"
                                                i_class=""
                                                name="quantity"
                                                min={1}
                                                max={product?.quantity || 10}
                                                onChng={(e) => {
                                                    setQuantity(e.target.value);
                                                }}
                                                onBlr={() => { }}
                                                val={quantityProd}
                                                style={{ width: "70px" }}
                                            />
                                        </>
                                    }
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
                                            // Bouton "Add to Cart" - conditions à vérifier
                                            // disabled={!product || !colorProd || quantityProd < 1}
                                            <button
                                                className="button border-0"
                                                type="button"
                                                onClick={uploadCart}
                                            >
                                                Add to Cart
                                            </button>
                                        )}

                                        {/* <button className="button signup">Buy It Now</button> */}
                                    </div>
                                </div>

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

                                <div className="d-flex gap-10 flex-column my-3">
                                    <h3 className="product-heading">Shipping & Returns :</h3>
                                    <p className="product-data">
                                        Free shipping and returns available on all orders! <br />
                                        We ship all US domestic orders within{" "}
                                        <b>5-10 business days!</b>
                                    </p>
                                </div>

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

            <Container class1="description-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <h4>Description</h4>
                        <div className="bg-white p-3">
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

            <Container class1="reviews-wrapper home-wrapper-2">
                <div className="row">
                    <div className="col-12">
                        <h3 id="review">Reviews</h3>
                        <div className="review-inner-wrapper">
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

            <Container class1="popular-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <ProductCard />
                </div>
            </Container>
        </>
    );
};

export default SingleProduct;