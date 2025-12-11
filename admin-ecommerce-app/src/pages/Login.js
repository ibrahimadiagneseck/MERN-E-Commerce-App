import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { 
  login, 
  clearAllMessages, 
  selectIsLoading, 
  selectError, 
  selectIsAuthenticated,
  selectSuccessMessage 
} from "../features/auth/authSlice";

/**
 * Schéma de validation Yup pour le formulaire de connexion
 */
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Veuillez entrer un email valide")
    .required("L'email est requis")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format d'email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

/**
 * Composant de connexion
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Sélecteurs
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // État local pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);
  
  /**
   * Configuration de Formik pour gérer le formulaire
   */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      // Efface les messages précédents
      dispatch(clearAllMessages());
      
      // Dispatch l'action de connexion
      dispatch(login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }));
    },
  });

  /**
   * Effet de redirection après connexion réussie
   */
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTimer = setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500); // Augmenté à 1.5s pour laisser voir le message de succès
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate]);

  /**
   * Effet de nettoyage des messages au démontage
   */
  useEffect(() => {
    return () => {
      dispatch(clearAllMessages());
    };
  }, [dispatch]);

  /**
   * Gère la soumission manuelle du formulaire
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Carte de connexion */}
      <div className="card shadow-lg border-0 rounded-lg" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="card-header bg-white border-0 text-center pt-4">
          <h3 className="title mb-0">
            <i className="bi bi-shield-lock me-2"></i>
            Connexion Admin
          </h3>
          <p className="desc mt-2 mb-0">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>
        
        <div className="card-body p-4">
          {/* Message d'erreur */}
          {error && (
            <div 
              className="alert alert-danger alert-dismissible fade show d-flex align-items-center" 
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div className="flex-grow-1">{error}</div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => dispatch(clearAllMessages())}
                aria-label="Fermer"
              ></button>
            </div>
          )}
          
          {/* Message de succès */}
          {successMessage && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>{successMessage} Redirection en cours...</div>
            </div>
          )}
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Champ Email */}
            <div className="mb-3">
              <CustomInput
                type="email"
                i_id="email"
                i_class={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                name="email"
                label="Adresse Email"
                placeholder="admin@example.com"
                val={formik.values.email}
                onChng={formik.handleChange("email")}
                onBlr={formik.handleBlur("email")}
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback d-flex align-items-center mt-1">
                  <i className="bi bi-x-circle-fill me-1"></i>
                  {formik.errors.email}
                </div>
              )}
            </div>
            
            {/* Champ Mot de passe avec CustomInput */}
            <div className="mb-3">
              <div className="position-relative">
                <CustomInput
                  type={showPassword ? "text" : "password"}
                  i_id="password"
                  i_class={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  label="Mot de passe"
                  placeholder="Mot de Passe"
                  val={formik.values.password}
                  onChng={formik.handleChange("password")}
                  onBlr={formik.handleBlur("password")}
                  disabled={isLoading}
                />
                {/* Bouton pour afficher/masquer le mot de passe */}
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "0 12px",
                    marginTop: "12px", // Ajustement pour alignement avec CustomInput
                    zIndex: 10
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback d-flex align-items-center mt-1">
                  <i className="bi bi-x-circle-fill me-1"></i>
                  {formik.errors.password}
                </div>
              )}
            </div>
            
            {/* Options supplémentaires */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <Link 
                to="/forgot-password" 
                className="text-decoration-none small"
                style={{ color: "#667eea" }}
              >
                <i className="bi bi-question-circle me-1"></i>
                Mot de passe oublié ?
              </Link>
            </div>
            
            {/* Boutons d'action */}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg fw-semibold"
                disabled={isLoading || !formik.isValid || isAuthenticated}
                style={{ 
                  backgroundColor: "var(--color-ffd333)", 
                  borderColor: "var(--color-ffd333)",
                  color: "#212529"
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;