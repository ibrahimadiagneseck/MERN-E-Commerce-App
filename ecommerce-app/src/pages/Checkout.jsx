import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { toast } from "react-toastify";
import Container from "../components-others/Container";
import { getUserCart, createAnOrder } from "../features/user/userSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupération des données depuis Redux
  const cartState = useSelector((state) => state.auth.cartProducts);
  const userState = useSelector((state) => state.auth.user);
  const orderLoading = useSelector((state) => state.auth.isLoading);

  // État local pour les données du panier
  const [cartData, setCartData] = useState({
    products: [],
    cartTotal: 0,
    totalAfterDiscount: 0,
  });

  // État pour l'adresse de livraison
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  // États pour les options de commande
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcul dynamique des frais de port selon la méthode choisie
  const getShippingFee = () => {
    switch (shippingMethod) {
      case "express":
        return 10;
      case "next_day":
        return 20;
      case "standard":
      case "store_pickup":
      default:
        return 0;
    }
  };

  const SHIPPING_FEE = getShippingFee();

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!userState) {
      toast.info("Veuillez vous connecter pour finaliser votre commande");
      navigate("/login");
    }
  }, [userState, navigate]);

  // Charger le panier au montage du composant
  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  // Mettre à jour l'état local quand le panier change
  useEffect(() => {
    if (cartState) {
      setCartData(cartState);
      if (userState) {
        setShippingAddress((prev) => ({
          ...prev,
          fullName: `${userState.firstname || ""} ${userState.lastname || ""}`.trim(),
          email: userState.email || "",
          phone: userState.mobile || "",
        }));
      }
    }
  }, [cartState, userState]);

  // Gestion des changements dans le formulaire d'adresse
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission de la commande
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    const requiredFields = [
      "fullName",
      "street",
      "city",
      "country",
      "phone",
      "email",
    ];
    
    const missing = requiredFields.find((field) => !shippingAddress[field]);
    if (missing) {
      toast.error(`Veuillez remplir le champ ${missing}`);
      return;
    }

    if (!cartData.products || cartData.products.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // ✅ Solution robuste : Forcer des valeurs par défaut pour state et postalCode
    // (même si le backend les prépare, on assure qu'ils ne sont ni undefined ni null)
    const addressToSend = {
      fullName: shippingAddress.fullName,
      street: shippingAddress.street,
      apartment: shippingAddress.apartment || "",
      city: shippingAddress.city,
      state: shippingAddress.state || "",           // Chaîne vide acceptée si backend gère
      country: shippingAddress.country,
      postalCode: shippingAddress.postalCode || "", // Chaîne vide acceptée
      phone: shippingAddress.phone,
      email: shippingAddress.email,
    };

    setIsSubmitting(true);

    // Construction de l'objet commande conforme au modèle
    const orderData = {
      shippingAddress: addressToSend,
      paymentMethod,
      shippingMethod,
      customerNotes,
    };

    try {
      const result = await dispatch(createAnOrder(orderData)).unwrap();
      // Redirection vers la page de confirmation
      navigate("/order-success", { state: { order: result.data.order } });
    } catch (error) {
      // L'erreur est déjà gérée par le toast dans le slice
      console.error("Erreur lors de la création de la commande:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculs financiers
  const subtotal = cartData.cartTotal || 0;
  const total = subtotal + SHIPPING_FEE;

  // Affichage si le panier est vide
  if (!cartData.products || cartData.products.length === 0) {
    return (
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12 text-center">
            <h4>Votre panier est vide</h4>
            <Link to="/products" className="button">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container class1="checkout-wrapper py-5 home-wrapper-2">
      <div className="row">
        {/* ========== COLONNE GAUCHE - FORMULAIRE ========== */}
        <div className="col-12 col-lg-7">
          <div className="checkout-left-data">
            <h3 className="website-name">Dev Corner</h3>
            
            {/* Fil d'Ariane */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="text-dark" to="/cart">
                    Panier
                  </Link>
                </li>
                &nbsp;/&nbsp;
                <li className="breadcrumb-item active" aria-current="page">
                  Information
                </li>
                &nbsp;/&nbsp;
                <li className="breadcrumb-item">Livraison</li>
                &nbsp;/&nbsp;
                <li className="breadcrumb-item">Paiement</li>
              </ol>
            </nav>

            <h4 className="title total">Contact</h4>
            <p className="user-details total">
              {userState?.firstname} {userState?.lastname} ({userState?.email})
            </p>

            <h4 className="mb-3">Adresse de livraison</h4>
            
            <form onSubmit={handleSubmit} className="d-flex gap-15 flex-wrap justify-content-between">
              {/* Pays */}
              <div className="w-100">
                <select
                  name="country"
                  className="form-control form-select"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Sélectionner un pays
                  </option>
                  <option value="SN">Sénégal</option>
                  <option value="FR">France</option>
                  <option value="US">États-Unis</option>
                  <option value="CA">Canada</option>
                  <option value="UK">Royaume-Uni</option>
                  <option value="DE">Allemagne</option>
                </select>
              </div>

              {/* Nom complet */}
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nom complet"
                  className="form-control"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Adresse */}
              <div className="w-100">
                <input
                  type="text"
                  name="street"
                  placeholder="Adresse (rue, numéro)"
                  className="form-control"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Appartement (optionnel) */}
              <div className="w-100">
                <input
                  type="text"
                  name="apartment"
                  placeholder="Appartement, suite, etc. (optionnel)"
                  className="form-control"
                  value={shippingAddress.apartment}
                  onChange={handleInputChange}
                />
              </div>

              {/* Ville */}
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="city"
                  placeholder="Ville"
                  className="form-control"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* État/Région (optionnel) */}
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="state"
                  placeholder="Région / État (optionnel)"
                  className="form-control"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                />
              </div>

              {/* Code postal (optionnel) */}
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Code postal (optionnel)"
                  className="form-control"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              {/* Téléphone */}
              <div className="flex-grow-1">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  className="form-control"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="w-100">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* ===== MODE DE LIVRAISON ===== */}
              <div className="w-100 mt-3">
                <h5>Mode de livraison</h5>
                
                {/* Standard */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="standard"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="standard">
                    <i className="me-2 text-secondary">📦</i> Standard (3-5 jours) - Gratuit
                  </label>
                </div>

                {/* Express */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="express"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="express">
                    <i className="me-2 text-warning">⚡</i> Express (1-2 jours) - $10.00
                  </label>
                </div>

                {/* Next day */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="nextDay"
                    value="next_day"
                    checked={shippingMethod === "next_day"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="nextDay">
                    <i className="me-2 text-danger">🚀</i> Livraison le lendemain - $20.00
                  </label>
                </div>

                {/* Retrait en magasin */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="storePickup"
                    value="store_pickup"
                    checked={shippingMethod === "store_pickup"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="storePickup">
                    <i className="me-2 text-success">🏪</i> Retrait en magasin - Gratuit
                  </label>
                </div>
              </div>

              {/* ===== MÉTHODE DE PAIEMENT ===== */}
              <div className="w-100 mt-3">
                <h5>Méthode de paiement</h5>
                
                {/* Paiement à la livraison */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cashOnDelivery"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cashOnDelivery">
                    <i className="me-2 text-success">💰</i> Paiement à la livraison
                  </label>
                </div>

                {/* Carte de crédit */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="creditCard"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="creditCard">
                    <i className="me-2 text-primary">💳</i> Carte de crédit
                  </label>
                </div>

                {/* Carte de débit */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="debitCard"
                    value="debit_card"
                    checked={paymentMethod === "debit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="debitCard">
                    <i className="me-2 text-primary">💳</i> Carte de débit
                  </label>
                </div>

                {/* PayPal */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paypal"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="paypal">
                    <i className="me-2 text-info">🅿️</i> PayPal
                  </label>
                </div>

                {/* Stripe */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="stripe"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="stripe">
                    <i className="me-2 text-purple">⚡</i> Stripe
                  </label>
                </div>

                {/* Virement bancaire */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="bankTransfer"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="bankTransfer">
                    <i className="me-2 text-secondary">🏦</i> Virement bancaire
                  </label>
                </div>
              </div>

              {/* ===== NOTES DU CLIENT ===== */}
              <div className="w-100 mt-3">
                <h5>Notes pour la commande (optionnel)</h5>
                <textarea
                  name="customerNotes"
                  className="form-control"
                  rows="3"
                  placeholder="Instructions spéciales pour la livraison, demande particulière, etc."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  maxLength="500"
                ></textarea>
                <small className="text-muted">{customerNotes.length}/500 caractères</small>
              </div>

              {/* Boutons de navigation */}
              <div className="w-100 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/cart" className="text-dark">
                    <BiArrowBack className="me-2" />
                    Retour au panier
                  </Link>
                  <button
                    type="submit"
                    className="button"
                    disabled={isSubmitting || orderLoading}
                  >
                    {isSubmitting ? "Traitement en cours..." : "Passer la commande"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ========== COLONNE DROITE - RÉCAPITULATIF ========== */}
        <div className="col-12 col-lg-5 mt-5 mt-lg-0">
          <div className="border-bottom py-4">
            {cartData.products.map((item, index) => {
              const product = item.product;
              return (
                <div key={index} className="d-flex gap-10 mb-3 align-items-center">
                  <div className="w-75 d-flex gap-10">
                    <div className="w-25 position-relative">
                      {product?.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          className="img-fluid"
                          alt={product.title}
                        />
                      ) : (
                        <div className="bg-light p-3 text-center">Image non disponible</div>
                      )}
                      <span
                        style={{ top: "-10px", right: "2px" }}
                        className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                      >
                        {item.count}
                      </span>
                    </div>
                    <div>
                      <h5 className="total-price">{product?.title}</h5>
                      <p className="total-price">Couleur: {item.color}</p>
                    </div>
                  </div>
                  <div className="flex-grow-1 text-end">
                    <h5 className="total">$ {item.subtotal?.toFixed(2)}</h5>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sous-total */}
          <div className="border-bottom py-4">
            <div className="d-flex justify-content-between align-items-center">
              <p className="total">Sous-total</p>
              <p className="total-price">$ {subtotal.toFixed(2)}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 total">Livraison ({shippingMethod})</p>
              <p className="mb-0 total-price">
                {SHIPPING_FEE === 0 ? "Gratuit" : `$ ${SHIPPING_FEE.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Total général */}
          <div className="d-flex justify-content-between align-items-center border-bottom py-4">
            <h4 className="total">Total</h4>
            <h5 className="total-price">$ {total.toFixed(2)}</h5>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;