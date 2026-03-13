import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiCheckCircle } from "react-icons/bi";
import Container from "../components-others/Container";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <Container class1="order-success-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-12 text-center">
          <BiCheckCircle className="text-success" size={80} />
          <h2 className="mt-3">Merci pour votre commande !</h2>
          <p className="lead">Votre commande a été enregistrée avec succès.</p>

          <div className="order-details mt-4 p-4 border rounded bg-light">
            <h4>Récapitulatif</h4>
            <p>
              <strong>Numéro de commande :</strong> {order.orderNumber}
            </p>
            <p>
              <strong>Total payé :</strong> $ {order.totalAmount?.toFixed(2)}
            </p>
            <p>
              <strong>Statut :</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Méthode de paiement :</strong>{" "}
              {order.paymentMethod === "cash_on_delivery"
                ? "Paiement à la livraison"
                : order.paymentMethod === "credit_card"
                ? "Carte de crédit"
                : order.paymentMethod === "debit_card"
                ? "Carte de débit"
                : order.paymentMethod === "paypal"
                ? "PayPal"
                : order.paymentMethod === "stripe"
                ? "Stripe"
                : order.paymentMethod === "bank_transfer"
                ? "Virement bancaire"
                : order.paymentMethod}
            </p>
            <p>
              <strong>Mode de livraison :</strong>{" "}
              {order.shippingMethod === "standard"
                ? "Standard"
                : order.shippingMethod === "express"
                ? "Express"
                : order.shippingMethod === "next_day"
                ? "Le lendemain"
                : order.shippingMethod === "store_pickup"
                ? "Retrait en magasin"
                : order.shippingMethod}
            </p>
          </div>

          <div className="mt-4">
            <Link to="/" className="button me-3">
              Retour à l'accueil
            </Link>
            <Link to="/my-orders" className="button-secondary">
              Voir mes commandes
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderSuccess;