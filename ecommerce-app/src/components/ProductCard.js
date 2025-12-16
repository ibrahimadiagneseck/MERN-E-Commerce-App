import React from 'react';
import { Link, useLocation } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/product/productSlice";

// Import des images
import wishIcon from "../images/wish.svg";
import watchImage from "../images/watch.jpg";
import cameraImage from "../images/camera.jpg";
import prodcompareIcon from "../images/prodcompare.svg";
import viewIcon from "../images/view.svg";
import addcartIcon from "../images/add-cart.svg";

const ProductCard = (props) => {
    const { grid, data } = props;
    let location = useLocation();
    const dispatch = useDispatch();

    const addToWishList = (id) => {
        // console.log("Adding to wishlist:", id);
        dispatch(addToWishlist(id));
    };

    // S'assurer que data est un tableau, même s'il n'y a qu'un seul produit
    const products = Array.isArray(data) ? data : (data ? [data] : []);

    // Fonction pour obtenir l'URL d'une image de manière sécurisée
    const getImageUrl = (item, index) => {
        if (!item?.images || !Array.isArray(item.images)) {
            // Retourner des images par défaut si pas d'images
            return index === 0 ? watchImage : cameraImage;
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
        return index === 0 ? watchImage : cameraImage;
    };

    // Helper function to safely render description
    const renderDescription = (description) => {
        if (!description) return '';
        return { __html: description };
    };

    return (
        <>
            {products?.map((item, index) => {
                // Convertir totalrating en nombre pour ReactStars
                const ratingValue = item?.totalrating ? 
                    (typeof item.totalrating === 'string' ? 
                        parseFloat(item.totalrating) : 
                        Number(item.totalrating)) 
                    : 0;

                return (
                    <div 
                        key={item?._id || index}
                        className={`${location.pathname === "/products" ? `gr-${grid}` : "col-3"}`}
                    >
                        <Link 
                            to={`/product/${item?._id || '1'}`} 
                            className="product-card position-relative"
                        >
                            <div className="wishlist-icon position-absolute">
                                <button 
                                    className="border-0 bg-transparent" 
                                    onClick={(e) => {
                                        e.preventDefault(); // empêche le rechargement de la page // Prevent link navigation
                                        addToWishList(item?._id);
                                    }}
                                >
                                    <img src={wishIcon} alt="wishlist" />
                                </button>
                            </div>
                            <div className="product-image">
                                <img 
                                    src={getImageUrl(item, 0)} 
                                    className="img-fluid mx-auto" 
                                    width={160} 
                                    alt={item?.title || "product"} 
                                />
                                <img 
                                    src={getImageUrl(item, 1)} 
                                    className="img-fluid mx-auto" 
                                    width={160} 
                                    alt={item?.title || "product"} 
                                />
                            </div>
                            <div className="product-details">
                                <h6 className="brand">{item?.brand || "Unknown Brand"}</h6>
                                <h5 className="product-title">
                                    {item?.title || "Product Title"}
                                </h5>
                                <ReactStars
                                    count={5}
                                    size={24}
                                    value={ratingValue}
                                    edit={false}
                                    activeColor="#ffd700"
                                />
                                
                                {item?.description && (
                                    <p 
                                        className={grid === 12 ? "description d-block" : "description d-none"}
                                        dangerouslySetInnerHTML={renderDescription(item.description)}
                                    />
                                )}
                                <p className="price">${item?.price || "0.00"}</p>
                            </div>
                            <div className="action-bar position-absolute">
                                <div className="d-flex flex-column gap-15">
                                    <button className="border-0 bg-transparent">
                                        <img src={prodcompareIcon} alt="compare" />
                                    </button>
                                </div>
                                <div className="d-flex flex-column">
                                    <button className="border-0 bg-transparent">
                                        <img src={viewIcon} alt="view" />
                                    </button>
                                </div>
                                <div className="d-flex flex-column">
                                    <button className="border-0 bg-transparent">
                                        <img src={addcartIcon} alt="addcart" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </>
    );
};

export default ProductCard;