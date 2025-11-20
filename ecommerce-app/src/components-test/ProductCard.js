// import { react } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const ProductCard = () => {
    return (
        <div className="col-3">
            <Link className="product-card position-relative">
                <div className="wishlist-icon position-absolute">
                    <Link><img src="images/wish.svg" alt="wishlist"/></Link>
                </div>
                <div className="product-image">
                    <img src="images/watch.jpg" className="img-fluid" alt="product"/>
                    <img src="images/camera.jpg" className="img-fluid" alt="product"/>
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
                    <p className="price">$100.00</p>
                </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column gap-15">
                        <Link><img src="images/prodcompare.svg" alt="compare"/></Link>
                    </div>
                    <div className="d-flex flex-column">
                        <Link><img src="images/view.svg" alt="view"/></Link>
                    </div>
                    <div className="d-flex flex-column">
                        <Link><img src="images/add-cart.svg" alt="addcart"/></Link>
                    </div>
                    <div className="d-flex flex-column">
                        <Link><img src="images/add-cart.svg" alt="addcart"/></Link>
                    </div>
                </div>
            </Link>
        </div>
    )
};

export default ProductCard;