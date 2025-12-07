import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

// Schéma de validation avec Yup pour le formulaire de login
// Définit les règles de validation pour l'email et le mot de passe
let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")  // Vérifie que l'email est valide
    .required("Email is Required"),  // Champ obligatoire
  password: yup.string().required("Password is Required"),  // Champ obligatoire
});

const Login = () => {
  // Initialisation des hooks React et Redux
  const dispatch = useDispatch();  // Pour dispatcher des actions Redux
  const navigate = useNavigate();  // Pour la navigation entre les pages
  
  // Configuration de Formik pour gérer le formulaire
  const formik = useFormik({
    initialValues: {
      email: "",      // Valeur initiale de l'email
      password: "",   // Valeur initiale du mot de passe
    },
    validationSchema: schema,  // Applique le schéma de validation Yup
    onSubmit: (values) => {
      // Lors de la soumission du formulaire, dispatch l'action de login
      dispatch(login(values));  // Envoie {email, password} au store Redux
    },
  });

  // Récupération de l'état d'authentification depuis le store Redux
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth  // Accède au slice "auth" du store Redux
  );

  // Effet qui s'exécute lorsque l'état d'authentification change
  useEffect(() => {
    // Si la connexion est réussie et qu'on a un utilisateur
    if (isSuccess && user) {
      navigate("/admin");  // Redirige vers la page admin
    }
    // Dépendances : l'effet se réexécute quand ces valeurs changent
  }, [isSuccess, user, navigate]);

  return (
    // Conteneur principal avec fond jaune
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      
      {/* Carte blanche contenant le formulaire */}
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        {/* Titre de la page */}
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        
        {/* Affichage des erreurs globales (si la connexion échoue) */}
        {isError && (
          <div className="alert alert-danger text-center">
            {message?.message || "Login failed. Please try again."}
          </div>
        )}
        
        {/* Formulaire de connexion */}
        <form onSubmit={formik.handleSubmit}>
          {/* Champ Email */}
          <CustomInput
            type="email"  // Type email pour la validation navigateur
            label="Email Address"  // Label du champ
            id="email"  // ID pour l'accessibilité
            name="email"  // Nom correspondant à l'état Formik
            onChng={formik.handleChange("email")}  // Gère les changements de valeur
            onBlr={formik.handleBlur("email")}  // Gère l'événement blur (perte de focus)
            val={formik.values.email}  // Valeur courante du champ
          />
          {/* Affichage des erreurs de validation pour l'email */}
          <div className="error mt-2">
            {formik.touched.email && formik.errors.email}
            {/* Affiche l'erreur seulement si le champ a été touché (focused puis blurred) */}
          </div>
          
          {/* Champ Mot de passe */}
          <CustomInput
            type="password"  // Masque les caractères saisis
            label="Password"
            id="pass"
            name="password"
            onChng={formik.handleChange("password")}
            onBlr={formik.handleBlur("password")}
            val={formik.values.password}
          />
          {/* Affichage des erreurs de validation pour le mot de passe */}
          <div className="error mt-2">
            {formik.touched.password && formik.errors.password}
          </div>
          
          {/* Lien "Mot de passe oublié" */}
          <div className="mb-3 text-end">
            <Link to="/forgot-password" className="">
              Forgot Password?
            </Link>
          </div>
          
          {/* Bouton de soumission */}
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5"
            style={{ background: "#ffd333" }}  // Couleur jaune
            type="submit"  // Type submit pour déclencher formik.handleSubmit
            disabled={isLoading}  // Désactive le bouton pendant le chargement
          >
            {/* Affiche "Loading..." pendant la requête, sinon "Login" */}
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;