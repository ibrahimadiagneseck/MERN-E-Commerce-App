// Importation des modules React et autres dépendances
import { useEffect, useState, useMemo } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, resetState } from "../features/product/productSlice";

// ------------------------------------------------------------
// 1. VALIDATION AVEC YUP - Définition du schéma de validation
// ------------------------------------------------------------
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup
    .array()
    .min(1, "Pick at least one color")
    .required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  // ------------------------------------------------------------
  // 2. HOOKS REACT - Gestion d'état et effets
  // ------------------------------------------------------------
  const dispatch = useDispatch(); // Hook Redux pour dispatcher des actions
  
  // useState - État local pour les couleurs sélectionnées
  const [color, setColor] = useState([]);
  
  // useEffect #1 - Chargement initial des données au montage
  useEffect(() => {
    dispatch(getBrands());      // Charge les marques depuis l'API
    dispatch(getCategories());  // Charge les catégories
    dispatch(getColors());      // Charge les couleurs
  }, [dispatch]); // Dépendance: dispatch (stable)

  // ------------------------------------------------------------
  // 3. REDUX - Sélection des états depuis le store
  // ------------------------------------------------------------
  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  
  // Destructuration des propriétés du produit
  const { isSuccess, isError, createdProduct } = newProduct;
  
  // ------------------------------------------------------------
  // 4. GESTION DES NOTIFICATIONS - Effet secondaire
  // ------------------------------------------------------------
  // useEffect #2 - Notification de succès/erreur
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, createdProduct]); // Déclenché quand ces valeurs changent

  // ------------------------------------------------------------
  // 5. TRANSFORMATION DES DONNÉES - Préparation pour l'UI
  // ------------------------------------------------------------
  // Formatage des couleurs pour le composant Select Antd
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: i.title, // Texte affiché
      value: i._id,   // Valeur envoyée au backend
    });
  });
  
  // useMemo - Optimisation: mémoïsation des images
  // Évite le recalcul à chaque rendu si imgState n'a pas changé
  const img = useMemo(() => {
    return imgState.map((i) => ({
      public_id: i.public_id,
      url: i.url,
    }));
  }, [imgState]); // Dépendance: recalcul si imgState change

  // ------------------------------------------------------------
  // 6. FORMIK - Configuration et gestion du formulaire
  // ------------------------------------------------------------
  const formik = useFormik({
    // Valeurs initiales des champs
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      color: "",
      quantity: "",
      images: "",
    },
    validationSchema: schema, // Schéma Yup pour la validation
    onSubmit: (values) => {
      // Soumission: envoie les données au backend via Redux
      dispatch(createProducts(values));
      
      // Réinitialisation après soumission
      formik.resetForm(); // Réinitialise Formik
      setColor(null);     // Réinitialise les couleurs
      
      // Réinitialisation de l'état Redux après délai
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    },
  });

  // ------------------------------------------------------------
  // 7. SYNCHRONISATION - Mise à jour des valeurs Formik
  // ------------------------------------------------------------
  // useEffect #3 - Synchronise couleur et images avec Formik
  useEffect(() => {
    formik.setFieldValue("color", color || []); // Met à jour le champ couleur
    formik.setFieldValue("images", img);        // Met à jour le champ images
  }, [color, img, formik]); // Déclenché quand couleur ou images changent

  // ------------------------------------------------------------
  // 8. GESTIONNAIRES D'ÉVÉNEMENTS - Fonctions de callback
  // ------------------------------------------------------------
  const handleColors = (e) => {
    setColor(e); // Met à jour l'état local des couleurs
    console.log(color); // Debug (à enlever en production)
  };

  // ------------------------------------------------------------
  // 9. RENDU JSX - Interface utilisateur
  // ------------------------------------------------------------
  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        {/* Formulaire principal avec gestion Formik */}
        <form
          onSubmit={formik.handleSubmit} // Gestionnaire de soumission Formik
          className="d-flex gap-3 flex-column"
        >
          {/* Champ: Titre du produit */}
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")} // Gestionnaire de changement
            onBlr={formik.handleBlur("title")}    // Gestionnaire de blur
            val={formik.values.title}             // Valeur courante
          />
          {/* Affichage des erreurs de validation */}
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          
          {/* Éditeur de texte riche (ReactQuill) pour la description */}
          <div className="">
            <ReactQuill
              theme="snow" // Thème visuel
              name="description"
              onChange={formik.handleChange("description")} // Met à jour Formik
              value={formik.values.description} // Valeur courante
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          
          {/* Champ: Prix du produit */}
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          
          {/* Sélecteur: Marque (brand) */}
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          
          {/* Sélecteur: Catégorie */}
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          
          {/* Sélecteur: Tags */}
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          {/* Sélecteur multiple: Couleurs (Ant Design) */}
          <Select
            mode="multiple" // Permet sélection multiple
            allowClear // Permet de vider la sélection
            className="w-100"
            placeholder="Select colors"
            defaultValue={color} // Valeur par défaut
            onChange={(i) => handleColors(i)} // Gestionnaire personnalisé
            options={coloropt} // Options formatées
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          
          {/* Champ: Quantité */}
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          
          {/* Zone de dépôt d'images (Dropzone) */}
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          
          {/* Prévisualisation des images uploadées */}
          <div className="showimages d-flex flex-wrap gap-3">
            {imgState?.map((i, j) => {
              return (
                <div className=" position-relative" key={j}>
                  {/* Bouton de suppression d'image */}
                  <button
                    type="button"
                    onClick={() => dispatch(delImg(i.public_id))} // Dispatch action suppression
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={i.url} alt="" width={200} height={200} />
                </div>
              );
            })}
          </div>
          
          {/* Bouton de soumission */}
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
