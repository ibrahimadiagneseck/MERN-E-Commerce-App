// Dans votre composant Cart
import { AiFillDelete } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Container from "../components-others/Container";
import CustomInput from "../components-others/CustomInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getUserCart, 
  emptyUserCart, 
  removeProductFromUserCart,
  updateProductQuantityInCart 
} from "../features/user/userSlice";

const Cart = () => {
    const userCartState = useSelector((state) => state?.auth?.cartProducts);
    const [cartData, setCartData] = useState({
        cartTotal: 0,
        products: [],
        totalAfterDiscount: 0
    });
    const [quantities, setQuantities] = useState({});
    const [isUpdating, setIsUpdating] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        const getCart = () => {
            dispatch(getUserCart());
        };

        getCart();
    }, [dispatch]);

    useEffect(() => {
        if (userCartState) {
            setCartData(userCartState);
            // Initialiser les quantités pour chaque produit
            const initialQuantities = {};
            userCartState.products?.forEach((item, index) => {
                initialQuantities[index] = item.count;
            });
            setQuantities(initialQuantities);
        }
    }, [userCartState]);

    const handleQuantityChange = (index, value) => {
        const product = cartData.products[index];
        if (!product) return;

        const availableQuantity = product.product?.quantity || 0;
        
        const newValue = Math.max(
            1,
            Math.min(
                availableQuantity,
                parseInt(value) || 1
            )
        );

        setQuantities({
            ...quantities,
            [index]: newValue
        });

        handleUpdateQuantity(index, product, newValue);
    };

    const handleUpdateQuantity = async (index, product, newQuantity) => {
        setIsUpdating({...isUpdating, [index]: true});
        
        const data = {
            productId: product.product?._id,
            color: product.color,
            newQuantity: newQuantity
        };
        
        try {
            
            await dispatch(updateProductQuantityInCart(data));
            dispatch(getUserCart());
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setIsUpdating({...isUpdating, [index]: false});
        }
    };

    const handleDeleteProduct = async (product) => {
        if (window.confirm("Are you sure you want to remove this product from your cart?")) {
            const data = {
                productId: product.product?._id,
                color: product.color
            };
            
            try {
                await dispatch(removeProductFromUserCart(data));
                dispatch(getUserCart());
            } catch (error) {
                console.error("Failed to remove product:", error);
            }
        }
    };

    const handleEmptyCart = async () => {
        if (window.confirm("Are you sure you want to empty your cart?")) {
            try {
                await dispatch(emptyUserCart());
                dispatch(getUserCart());
            } catch (error) {
                console.error("Failed to empty cart:", error);
            }
        }
    };

    return (
        <>
            <Meta title={"Cart"} />
            <BreadCrumb title="Cart" />
            <Container class1="cart-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-12">
                        <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                            <h4 className="cart-col-2">Product</h4>
                            <h4 className="cart-col-1">Price</h4>
                            <h4 className="cart-col-3">Quantity</h4>
                            <h4 className="cart-col-4">Total</h4>
                        </div>

                        {cartData.products && cartData.products.length > 0 ? (
                            <>
                                {cartData.products.map((item, index) => {
                                    const quantity = quantities[index] || item.count;
                                    const availableQuantity = item.product?.quantity || 0;

                                    return (
                                        <div
                                            key={item._id || index}
                                            className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                                        >
                                            <div className="cart-col-1 gap-15 d-flex align-items-center">
                                                <div className="w-25">
                                                    {item.product?.images?.[0]?.url ? (
                                                        <img
                                                            src={item.product.images[0].url}
                                                            className="img-fluid"
                                                            alt={item.product.title}
                                                        />
                                                    ) : (
                                                        <div className="img-placeholder">No Image</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="mb-1"><strong>{item.product?.title}</strong></p>
                                                    <p className="mb-1 text-muted">Brand: {item.product?.brand}</p>
                                                    <p className="mb-1 text-muted">Category: {item.product?.category}</p>
                                                    <div className="d-flex align-items-center gap-2 mt-2">
                                                        <span className="text-muted">Color:</span>
                                                        <div
                                                            className="color-indicator"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                backgroundColor: item.color,
                                                                borderRadius: '50%',
                                                                border: '1px solid #ddd'
                                                            }}
                                                            title={item.color}
                                                        ></div>
                                                    </div>
                                                    <p className="mb-0 text-muted small mt-1">
                                                        Available: {availableQuantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="cart-col-2">
                                                <h5 className="price">$ {item.price?.toFixed(2)}</h5>
                                            </div>
                                            <div className="cart-col-3 d-flex align-items-center gap-15">
                                                <div className="quantity-control">
                                                    <CustomInput
                                                        type="number"
                                                        label="Quantity"
                                                        i_id={`quantity-${index}`}
                                                        i_class="form-control"
                                                        name={`quantity-${index}`}
                                                        val={quantity}
                                                        onChng={(e) => handleQuantityChange(index, e.target.value)}
                                                        min={1}
                                                        max={availableQuantity}
                                                        disabled={isUpdating[index]}
                                                    />
                                                    {quantity === availableQuantity && availableQuantity > 0 && (
                                                        <p className="text-warning small mt-1 mb-0">
                                                            Maximum quantity reached
                                                        </p>
                                                    )}
                                                    {isUpdating[index] && (
                                                        <p className="text-info small mt-1 mb-0">
                                                            Updating...
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <AiFillDelete 
                                                        className="text-danger" 
                                                        style={{ cursor: 'pointer', fontSize: '1.5rem' }} 
                                                        onClick={() => handleDeleteProduct(item)}
                                                        title="Remove from cart"
                                                    />
                                                </div>
                                            </div>
                                            <div className="cart-col-4">
                                                {/* Utiliser le subtotal du backend au lieu de le calculer */}
                                                <h5 className="price">$ {item.subtotal?.toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div className="d-flex justify-content-end mt-3 mb-3">
                                    <button 
                                        className="btn btn-danger d-flex align-items-center gap-2"
                                        onClick={handleEmptyCart}
                                    >
                                        <BsTrash /> Empty Cart
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <p>Your cart is empty</p>
                                <Link to="/product" className="button">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {cartData.products && cartData.products.length > 0 && (
                        <div className="col-12 py-2 mt-4">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <Link to="/product" className="button">
                                    Continue To Shopping
                                </Link>
                                <div className="d-flex flex-column align-items-end">
                                    {/* Utiliser cartTotal du backend */}
                                    <h4>SubTotal: $ {cartData.cartTotal?.toFixed(2)}</h4>
                                    {cartData.totalAfterDiscount !== cartData.cartTotal && (
                                        <>
                                            <p className="text-decoration-line-through text-muted">
                                                Original Total: ${cartData.cartTotal?.toFixed(2)}
                                            </p>
                                            <p className="text-success">
                                                Discount Applied! New Total: ${cartData.totalAfterDiscount?.toFixed(2)}
                                            </p>
                                            <p className="text-success fw-bold">
                                                You save: ${(cartData.cartTotal - cartData.totalAfterDiscount).toFixed(2)}
                                            </p>
                                        </>
                                    )}
                                    <p className="text-muted small">Taxes and shipping calculated at checkout</p>
                                    <div className="d-flex gap-3 mt-2">
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={handleEmptyCart}
                                        >
                                            Empty Cart
                                        </button>
                                        <Link to="/checkout" className="button">
                                            Proceed to Checkout
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default Cart;