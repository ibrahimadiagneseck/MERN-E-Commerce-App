import React from 'react';
import { Link, useLocation } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

// const imagePaths = {
//     wish: "/images/wish.svg",
//     watch: "/images/watch.jpg",
//     camera: "/images/camera.jpg",
//     prodcompare: "/images/prodcompare.svg",
//     view: "/images/view.svg",
//     addcart: "/images/add-cart.svg"
// };

// Import des images
import wishIcon from "../images/wish.svg";
import watchImage from "../images/watch.jpg";
import cameraImage from "../images/camera.jpg";
import prodcompareIcon from "../images/prodcompare.svg";
import viewIcon from "../images/view.svg";
import addcartIcon from "../images/add-cart.svg";

const ProductCard = (props) => {
    const { grid } = props;
    let location = useLocation();

    return (
        <>
            <div className={`${location.pathname === "/products" ? `gr-${grid}` : "col-3"}`}>
                {/* <Link to=":id" className="product-card position-relative"> */}
                <Link to="/product/1" className="product-card position-relative">
                {/* <Link to={`${location.pathname === "/" ? "product/:id" : "/product/:id"}`} className="product-card position-relative"> */}
                    <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent">
                            <img src={wishIcon} alt="wishlist" />
                        </button>
                    </div>
                    <div className="product-image">
                        <img src={watchImage} className="img-fluid" alt="product" />
                        <img src={cameraImage} className="img-fluid" alt="product" />
                    </div>
                    <div className="product-details">
                        <h6 className="brand">havells</h6>
                        <h5 className="product-title">
                            Kids headphones bulk 10 pack multi colored for students
                        </h5>
                        <ReactStars
                            count={5}
                            size={24}
                            value={3}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <p className={grid === 12 ? "description d-block" : "description d-none"}>
                            At vero eos et accusamus et justo odio dignissimos ducimus qui blanditis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt...
                        </p>
                        <p className="price">$100.00</p>
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
            
            <div className={`${location.pathname === "/products" ? `gr-${grid}` : "col-3"}`}>
                <Link to="/product/2" className="product-card position-relative">
                {/* <Link to={`/product/${product.id}`} className="product-card position-relative"> */}
                {/* <Link to={`${location.pathname === "/" ? "product/:id" : "/product/:id"}`} className="product-card position-relative"> */}

                    <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent">
                            <img src={wishIcon} alt="wishlist" />
                        </button>
                    </div>
                    <div className="product-image">
                        <img src={watchImage} className="img-fluid" alt="product" />
                        <img src={cameraImage} className="img-fluid" alt="product" />
                    </div>
                    <div className="product-details">
                        <h6 className="brand">havells</h6>
                        <h5 className="product-title">
                            Kids headphones bulk 10 pack multi colored for students
                        </h5>
                        <ReactStars
                            count={5}
                            size={24}
                            value={3}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <p className={grid === 12 ? "description d-block" : "description d-none"}>
                            At vero eos et accusamus et justo odio dignissimos ducimus qui blanditis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt...
                        </p>
                        <p className="price">$100.00</p>
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
        </>
    )
};

export default ProductCard;