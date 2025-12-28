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
// import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../features/products/productSlice";
import { toast } from "react-toastify";
import watchImage from "../images/watch.jpg";
import { addProdToCart } from "../features/user/userSlice";

const SingleProduct = () => {

    // const location = useLocation();
    const { id: productId } = useParams();

    const productState = useSelector((state) => state?.product?.product);

    const product = productState && typeof productState === 'object' ? productState : null;

    const ratingValue = product?.totalrating ?
        (typeof product.totalrating === 'string' ?
            parseFloat(product.totalrating) :
            Number(product.totalrating))
        : 0;


    const dispatch = useDispatch();

    useEffect(() => {
        const getProductId = (id) => {
            dispatch(getProduct(id));
        };

        getProductId(productId);
    }, [dispatch, productId]);

    const [colorProd, setColor] = useState(null);
    const [quantityProd, setQuantity] = useState(1);
    

    // Fonction pour ajouter au panier
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

    // Format des données CORRECT pour l'Option 2
    const cartData = {
      productId: productId,
      color: colorProd,
      quantity: Number(quantityProd)
    };

    // console.log("Sending cart data:", cartData);
    
    dispatch(addProdToCart(cartData));
    // toast.success("Product added to cart!");
  };

    const getImageUrl = (item, index) => {
        if (!item?.images || !Array.isArray(item.images)) {
            // Retourner des images par défaut si pas d'images
            return index === 0 ? watchImage : watchImage;
        }

        if (item.images.length > index) {
            // Si l'image a une propriété url
            if (item.images[index]?.url) {
                return item.images[index].url;
            }
            // Si l'image est une string directement
            if (typeof item.images[index] === 'string') {
                return item.images[index];
            }
        }

        // Retourner des images par défaut
        return index === 0 ? watchImage : watchImage;
    };


    const props = {
        width: 400,
        height: 600,
        zoomWidth: 600,
        img: getImageUrl(product, 0) || "https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
    };


    const [orderedProduct] = useState(true); // Suppression de setOrderedProduct non utilisé

    // Fonction pour sécuriser et éventuellement tronquer le contenu du blog
    const renderContent = (content) => {
        if (!content) return { __html: '' };
        if (content.__html !== undefined) return content;
        if (typeof content === 'string') {
            const truncated = content.length > 500 ? content.slice(0, 500) + "..." : content;
            return { __html: truncated };
        }
        return { __html: '' };
    };


    const copyToClipboard = async (text) => { // <-- ici, plus de ": string"
        // Vérifie si le navigateur supporte l'API Clipboard et le contexte sécurisé
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text); // Copier dans le presse-papiers
                toast.success("Product link copied to clipboard!"); // Toast succès
            } catch (err) {
                //   console.error("Clipboard API failed:", err);
                fallbackCopy(text); // Fallback si l'API échoue
            }
        } else {
            fallbackCopy(text); // Fallback pour anciens navigateurs ou contextes non sécurisés
        }
    };

    // Fallback simple via prompt pour copier manuellement
    const fallbackCopy = (text) => { // <-- aussi ici
        try {
            // prompt("Copy this link manually:", text);
            toast.info("Use prompt to copy the link manually."); // Toast info
        } catch (err) {
            // console.error("Manual copy failed:", err);
            toast.error("Failed to copy the link."); // Toast erreur
        }
    };


    const handleAddToCompare = (e) => {
        e.preventDefault();
        console.log("Add to compare clicked");
        // Ajouter ici la logique pour comparer le produit
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        console.log("Add to wishlist clicked");
        // Ajouter ici la logique pour ajouter au wishlist
    };

    const handleWriteReview = (e) => {
        e.preventDefault();
        console.log("Write review clicked");
        // Ajouter ici la logique pour écrire une review
    };

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
                                product.images.map((_, index) => ( // utilise _ lorsque l’élément n’est pas utilisé.
                                    <div key={index}>
                                        <img
                                            src={getImageUrl(product, index)}
                                            className="img-fluid"
                                            alt={`product-${index}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                // Fallback : aucune image → image par défaut
                                <div>
                                    <img
                                        src={watchImage}
                                        className="img-fluid"
                                        alt="default-product"
                                    />
                                </div>
                            )}
                        </div>

                        {/* <div className="other-product-images d-flex flex-wrap gap-15">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index}>
                                <img
                                    src={getImageUrl(product, index)}
                                    className="img-fluid"
                                    alt={`product-${index}`}
                                />
                                </div>
                            ))}
                        </div> */}
                    </div>
                    <div className="col-6">
                        <div className="main-product-details">
                            <div className="border-bottom">
                                <h3 className="title">
                                    {product?.title}
                                </h3>
                            </div>
                            <div className="border-bottom py-3">
                                <p className="price">$ {product?.price}</p>
                                <div className="d-flex align-items-center gap-10">
                                    {/* <ReactStars
                                        readonly
                                        count={5}
                                        size={24}
                                        value={ratingValue}
                                        edit={false}
                                        activeColor="#ffd700"
                                    /> */}
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
                                    onClick={() => document.getElementById('review').scrollIntoView({ behavior: 'smooth' })}
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
                                    <p className="product-data">
                                        {product?.tags?.join(", ")}
                                    </p>
                                </div>
                                <div className="d-flex gap-10 align-items-center my-2">
                                    <h3 className="product-heading">Availability :</h3>
                                    <p className="product-data">In Stock</p>
                                </div>
                                <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                    <h3 className="product-heading">Size :</h3>
                                    <div className="d-flex flex-wrap gap-15">
                                        <span className="badge border border-1 bg-white text-dark border-secondary">S</span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">M</span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">XL</span>
                                        <span className="badge border border-1 bg-white text-dark border-secondary">XXL</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                    <h3 className="product-heading">Color :</h3>
                                    <Color setColor={setColor} colorData={product?.color} />
                                </div>
                                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                                    <h3 className="product-heading">Quantity :</h3>
                                    <CustomInput
                                        type="number"
                                        label="Quantity"
                                        i_id="quantity"
                                        i_class=""
                                        name="quantity"
                                        min={1}
                                        max={product?.quantity || 10}
                                        onChng={(e) => { setQuantity(e.target.value) }} // Ajoutez un gestionnaire vide
                                        onBlr={() => { }}  // Ajoutez aussi onBlr pour être complet
                                        val={quantityProd} // valeur par défaut
                                        style={{ width: "70px" }}
                                    />
                                    <div className="d-flex align-items-center gap-30 ms-5">
                                        {/* <button
                                            className="button border-0"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            type="button"
                                            onClick={uploadCart}
                                        >
                                            Add to Cart
                                        </button> */}

                                        {/* Avec paramètres, on DOIT utiliser la version avec fonction fléchée */}
                                        {/* <button className="button border-0" type="button"
                                            onClick={() => uploadCart(productId, quantityProd)}>
                                            Add to Cart
                                        </button> */}

                                        {/* <button 
                                            className="button border-0" 
                                            type="button" 
                                            onClick={uploadCart}
                                            disabled={!product || !colorProd}
                                        >
                                            Add to Cart
                                        </button> */}

                                        <button 
                                            className="button border-0" 
                                            type="button" 
                                            onClick={uploadCart}
                                        >
                                            Add to Cart
                                        </button>

                                        <button className="button signup">Buy It Now</button>
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
                                        We ship all US domestic orders within <b>5-10 business days!</b>
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
                                    {/* <button 
                                            className="border-0 bg-transparent text-decoration-underline p-0"
                                            onClick={() => {
                                                copyToClipboard("https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80");
                                            }}
                                        >
                                            Copy Product Link
                                        </button> */}
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
                            <p className="desc" dangerouslySetInnerHTML={renderContent(product?.description)}></p>
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
                                {orderedProduct && (
                                    <div>
                                        <button
                                            className="text-dark text-decoration-underline border-0 bg-transparent p-0"
                                            onClick={handleWriteReview}
                                        >
                                            Write a Review
                                        </button>
                                    </div>
                                )}
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
                                        Tenetur nisi similique illum aut perferendis voluptas, quisquam
                                        obcaecati qui nobis officia. Voluptatibus in harum deleniti
                                        labore maxime officia esse eos? Repellat?
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