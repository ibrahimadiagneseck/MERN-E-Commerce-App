import { useEffect, useState, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart, logout } from "../features/user/userSlice";
import { toast } from "react-toastify";

const Header = () => {
    // ============================================
    // 1. INITIALISATION DES HOOKS ET ÉTATS
    // ============================================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // ============================================
    // 2. RÉCUPÉRATION DES DONNÉES DEPUIS REDUX
    // ============================================
    const userCartState = useSelector((state) => state?.auth?.cartProducts);
    const authState = useSelector((state) => state?.auth);
    const userState = useSelector((state) => state?.auth?.user);

    // ============================================
    // 3. CALCUL DES DONNÉES DU PANIER BASÉ SUR VOTRE STRUCTURE
    // ============================================
    const cartData = useMemo(() => {
        if (!userCartState || !userCartState.products) {
            return { 
                itemCount: 0, 
                totalAmount: 0,
                cartTotal: 0,
                totalAfterDiscount: 0,
                products: [],
                discountAmount: 0
            };
        }
        
        // VOTRE STRUCTURE : products est un tableau avec count, price, subtotal
        const itemCount = userCartState.products.reduce((total, item) => {
            return total + (Number(item.count) || 0);
        }, 0);
        
        // Utiliser vos champs exacts
        const cartTotal = userCartState.cartTotal || 0;
        const totalAfterDiscount = userCartState.totalAfterDiscount || cartTotal;
        const discountAmount = cartTotal - totalAfterDiscount;
        
        return {
            itemCount,
            totalAmount: totalAfterDiscount, // Montant final affiché
            cartTotal, // Total avant réduction
            totalAfterDiscount, // Total après réduction
            discountAmount, // Montant de la réduction
            products: userCartState.products || []
        };
    }, [userCartState]);

    // ============================================
    // 4. CALCUL DES STATISTIQUES DU PANIER
    // ============================================
    const cartStats = useMemo(() => {
        if (!cartData.products || cartData.products.length === 0) {
            return {
                totalItems: 0,
                uniqueProducts: 0,
                categories: [],
                colors: [],
                brands: []
            };
        }

        // Compter les produits uniques basés sur product._id
        const uniqueProducts = new Set(
            cartData.products
                .filter(item => item.product && item.product._id)
                .map(item => item.product._id.toString())
        ).size;

        // Extraire les catégories uniques
        const categories = [...new Set(
            cartData.products
                .filter(item => item.product && item.product.category)
                .map(item => item.product.category)
        )];

        // Extraire les couleurs uniques
        const colors = [...new Set(
            cartData.products
                .filter(item => item.color)
                .map(item => item.color)
        )];

        // Extraire les marques uniques
        const brands = [...new Set(
            cartData.products
                .filter(item => item.product && item.product.brand)
                .map(item => item.product.brand)
        )];

        return {
            totalItems: cartData.itemCount,
            uniqueProducts,
            categories,
            colors,
            brands
        };
    }, [cartData]);

    // ============================================
    // 5. CHARGEMENT INITIAL DES DONNÉES
    // ============================================
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                if (authState?.user) {
                    await dispatch(getUserCart());
                }
            } catch (error) {
                console.error("Failed to fetch cart data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [dispatch, authState?.user]);

    // ============================================
    // 6. FONCTIONS DE GESTION D'ÉVÉNEMENTS
    // ============================================
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            toast.info("Please enter a search term");
            return;
        }
        
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
    };

    const handleUserAction = () => {
        if (authState?.user) {
            setShowUserDropdown(!showUserDropdown);
            setShowCartDropdown(false);
        } else {
            navigate('/login');
        }
    };

    const handleCartAction = () => {
        if (cartData.products.length > 0) {
            setShowCartDropdown(!showCartDropdown);
            setShowUserDropdown(false);
        } else {
            navigate('/cart');
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logout());
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // ============================================
    // 7. CATÉGORIES
    // ============================================
    const categories = [
        { id: 1, name: "Electronics", path: "/category/electronics" },
        { id: 2, name: "Fashion", path: "/category/fashion" },
        { id: 3, name: "Home & Garden", path: "/category/home-garden" },
        { id: 4, name: "Books", path: "/category/books" },
        { id: 5, name: "Sports", path: "/category/sports" },
        { id: 6, name: "Health & Beauty", path: "/category/health-beauty" },
    ];

    return (
        <>
            {/* BANDE SUPÉRIEURE - INFORMATIONS */}
            <header className="header-top-strip py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-6">
                            <p className="text-white mb-0">
                                Free Shipping Over $100 & Free Returns
                            </p>
                        </div>
                        <div className="col-6">
                            <p className="text-end text-white mb-0">
                                Hotline: <a className="text-white" href="tel:+221775211787">+221 77 521 17 87</a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* EN-TÊTE PRINCIPAL */}
            <header className="header-upper py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-2">
                            <h2>
                                <Link to="/" className="text-white">DS Ibrahima.</Link>
                            </h2>
                        </div>
                        <div className="col-5">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    placeholder="Search Product Here"
                                    aria-label="Search Product Here"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    onClick={handleSearch}
                                    className="input-group-text p-3"
                                    id="basic-addon2"
                                >
                                    <BsSearch className="fs-6" />
                                </button>
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="header-upper-links d-flex align-items-center justify-content-between">
                                
                                {/* BARRE 1 : Comparaison */}
                                <div>
                                    <Link to='/compare-product' className="d-flex align-items-center gap-10 text-white">
                                        <img src={compare} alt="compare" />
                                        <p className="mb-0">
                                            Compare <br /> Products
                                        </p>
                                    </Link>
                                </div>
                                
                                {/* BARRE 2 : Wishlist */}
                                <div>
                                    <Link to='/wishlist' className="d-flex align-items-center gap-10 text-white">
                                        <img src={wishlist} alt="wishlist" />
                                        <p className="mb-0">
                                            Favourite <br /> Wishlist
                                        </p>
                                    </Link>
                                </div>
                                
                                {/* BARRE 3 : Compte utilisateur (avec dropdown) */}
                                <div className="position-relative">
                                    <button
                                        onClick={handleUserAction}
                                        className="d-flex align-items-center gap-10 text-white bg-transparent border-0 p-0"
                                    >
                                        <img src={user} alt="user" />
                                        <p className="mb-0">
                                            {authState?.user ? 'Welcome' : 'Log in'} <br />
                                            {authState?.user ? (userState?.firstname || 'My Account') : 'My Account'}
                                        </p>
                                    </button>
                                    
                                    {/* Dropdown utilisateur */}
                                    {showUserDropdown && authState?.user && (
                                        <div className="position-absolute top-100 end-0 mt-2 bg-white rounded shadow-lg p-3"
                                             style={{ width: '250px', zIndex: 1050 }}>
                                            <div className="text-center mb-3">
                                                <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-2"
                                                     style={{ width: '60px', height: '60px' }}>
                                                    <span className="text-white fs-4">
                                                        {userState?.firstname?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <h6 className="mb-1">{userState?.firstname} {userState?.lastname}</h6>
                                                <small className="text-muted">{userState?.email}</small>
                                            </div>
                                            
                                            <div className="border-top pt-3">
                                                <Link to="/my-profile" className="d-block text-dark mb-2 text-decoration-none">
                                                    <i className="bi bi-person me-2"></i> My Profile
                                                </Link>
                                                <Link to="/my-orders" className="d-block text-dark mb-2 text-decoration-none">
                                                    <i className="bi bi-bag me-2"></i> My Orders
                                                </Link>
                                                <Link to="/wishlist" className="d-block text-dark mb-3 text-decoration-none">
                                                    <i className="bi bi-heart me-2"></i> My Wishlist
                                                </Link>
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* BARRE 4 : Panier (avec dropdown détaillé) */}
                                <div className="position-relative">
                                    <button
                                        onClick={handleCartAction}
                                        className="d-flex align-items-center gap-10 text-white bg-transparent border-0 p-0"
                                    >
                                        <div className="position-relative">
                                            <img src={cart} alt="cart" />
                                            {cartData.itemCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge bg-warning text-dark rounded-pill">
                                                    {cartData.itemCount > 99 ? '99+' : cartData.itemCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="d-flex flex-column gap-10 p-2">
                                            <span className="badge bg-white text-dark">
                                                {isLoading ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    cartData.itemCount
                                                )}
                                            </span>
                                            <p className="mb-0">
                                                {isLoading ? 'Loading...' : formatCurrency(cartData.totalAmount)}
                                            </p>
                                        </div>
                                    </button>
                                    
                                    {/* Dropdown panier détaillé avec VOS DONNÉES */}
                                    {showCartDropdown && cartData.products.length > 0 && (
                                        <div className="position-absolute top-100 end-0 mt-2 bg-white rounded shadow-lg p-3"
                                             style={{ width: '350px', zIndex: 1050 }}>
                                            {/* En-tête avec statistiques */}
                                            <div className="border-bottom pb-3 mb-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0 text-dark">Cart Summary</h6>
                                                    <div className="text-end">
                                                        <div className="small text-muted">
                                                            {cartStats.totalItems} items
                                                        </div>
                                                        <div className="small text-muted">
                                                            {cartStats.uniqueProducts} unique products
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Liste des produits */}
                                            <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {cartData.products.slice(0, 2).map((item, index) => (
                                                    <div key={index} className="d-flex align-items-center mb-3">
                                                        <div className="me-3">
                                                            {item.product?.images?.[0]?.url ? (
                                                                <img 
                                                                    src={item.product.images[0].url} 
                                                                    alt={item.product.title}
                                                                    className="rounded border"
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <div className="bg-light rounded border d-flex align-items-center justify-content-center"
                                                                     style={{ width: '60px', height: '60px' }}>
                                                                    <small className="text-muted">No Image</small>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1 text-dark small">{item.product?.title}</h6>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <small className="text-muted d-block">
                                                                        Qty: <strong>{item.count}</strong>
                                                                    </small>
                                                                    {item.color && (
                                                                        <small className="text-muted">
                                                                            Color: 
                                                                            <span 
                                                                                className="ms-1 d-inline-block rounded-circle"
                                                                                style={{
                                                                                    width: '12px',
                                                                                    height: '12px',
                                                                                    backgroundColor: item.color,
                                                                                    border: '1px solid #ddd'
                                                                                }}
                                                                                title={item.color}
                                                                            ></span>
                                                                        </small>
                                                                    )}
                                                                </div>
                                                                <div className="text-end">
                                                                    <small className="text-muted d-block">
                                                                        {formatCurrency(item.price)} each
                                                                    </small>
                                                                    <strong className="text-dark">
                                                                        {formatCurrency(item.subtotal || (item.price * item.count))}
                                                                    </strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {cartData.products.length > 3 && (
                                                    <div className="text-center mt-2">
                                                        <small className="text-muted">
                                                            + {cartData.products.length - 3} more items in cart
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Détails des totaux */}
                                            <div className="border-top pt-3">
                                                <div className="mb-3">
                                                    {cartData.cartTotal !== cartData.totalAfterDiscount ? (
                                                        <>
                                                            <div className="d-flex justify-content-between">
                                                                <span className="text-muted">Subtotal:</span>
                                                                <span>{formatCurrency(cartData.cartTotal)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between text-success">
                                                                <span>Discount:</span>
                                                                <span>-{formatCurrency(cartData.discountAmount)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mt-2 fw-bold">
                                                                <span>Total:</span>
                                                                <span className="text-primary">{formatCurrency(cartData.totalAfterDiscount)}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="d-flex justify-content-between fw-bold">
                                                            <span>Total:</span>
                                                            <span className="text-primary">{formatCurrency(cartData.totalAmount)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="d-grid gap-2">
                                                    <Link 
                                                        to="/cart" 
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => setShowCartDropdown(false)}
                                                    >
                                                        View Full Cart
                                                    </Link>
                                                    <Link 
                                                        to="/checkout" 
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => setShowCartDropdown(false)}
                                                    >
                                                        Proceed to Checkout
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MENU DE NAVIGATION */}
            <header className="header-bottom py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div className="menu-bottom d-flex align-items-center gap-30">
                                <div>
                                    <div className="dropdown">
                                        <button className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src={menu} alt="" />
                                            <span className="me-5 d-inline-block">Shop Categories</span>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            {categories.map((category) => (
                                                <li key={category.id}>
                                                    <Link className="dropdown-item text-white" to={category.path}>
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="menu-links">
                                    <div className="d-flex align-items-center gap-15">
                                        <NavLink to="/" className="text-white text-decoration-none">
                                            Home
                                        </NavLink>
                                        <NavLink to="/products" className="text-white text-decoration-none">
                                            Our Store
                                        </NavLink>
                                        <NavLink to="/blogs" className="text-white text-decoration-none">
                                            Blogs
                                        </NavLink>
                                        <NavLink to="/contact" className="text-white text-decoration-none">
                                            Contact
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay pour fermer les dropdowns quand on clique ailleurs */}
            {(showCartDropdown || showUserDropdown) && (
                <div 
                    className="position-fixed top-0 left-0 w-100 h-100"
                    style={{ zIndex: 1040 }}
                    onClick={() => {
                        setShowCartDropdown(false);
                        setShowUserDropdown(false);
                    }}
                />
            )}
        </>
    );
};

export default Header;