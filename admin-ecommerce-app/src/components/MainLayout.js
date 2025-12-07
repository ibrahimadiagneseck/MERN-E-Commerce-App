// Importation de React et de useState (hook pour gérer l'état)
import React, { useState } from "react";

// Importation des icônes d'Ant Design
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

// Importation des icônes de React Icons
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";

// Importation des composants pour les notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importation des composants de routage
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Importation des composants Ant Design
import { Layout, Menu, theme } from "antd";

// Destructuration des composants Layout d'Ant Design
const { Header, Sider, Content } = Layout;

// Composant principal MainLayout
const MainLayout = () => {
  
  // État pour gérer si le menu latéral est réduit ou non
  const [collapsed, setCollapsed] = useState(false);

  // Utilisation du thème Ant Design pour les couleurs
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Hook pour la navigation entre les pages
  const navigate = useNavigate();

  return (
    // Layout principal avec prévention du menu contextuel (commenté)
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      {/* 
        Menu latéral (Sider)
        - trigger={null} : pas de bouton de déclenchement automatique
        - collapsible : peut être réduit/déplié
        - collapsed : état de réduction contrôlé par l'état "collapsed"
      */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* Logo de l'application */}
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">ID'S</span> {/* Version courte */}
            <span className="lg-logo">Ibrahima</span> {/* Version longue */}
          </h2>
        </div>

        {/* Menu de navigation principal */}
        <Menu
          theme="dark" // Thème sombre
          mode="inline" // Mode aligné verticalement
          defaultSelectedKeys={[""]} // Élément sélectionné par défaut
          onClick={({ key }) => {
            // Gestionnaire de clic pour les éléments du menu
            if (key === "signout") {
              // À implémenter : déconnexion
            } else {
              navigate(key); // Navigation vers la route correspondante
            }
          }}
          items={[
            // Tableau d'éléments du menu
            {
              key: "", // Clé correspondant à la route
              icon: <AiOutlineDashboard className="fs-4" />, // Icône
              label: "Dashboard", // Texte affiché
            },
            {
              key: "customers",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Customers",
            },
            {
              key: "Catalog",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Catalog",
              children: [ // Sous-menu
                {
                  key: "product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Product",
                },
                {
                  key: "list-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Product List",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand",
                },
                {
                  key: "list-brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand List",
                },
                {
                  key: "category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category",
                },
                {
                  key: "list-category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category List",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color List",
                },
              ],
            },
            {
              key: "orders",
              icon: <FaClipboardList className="fs-4" />,
              label: "Orders",
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Coupon",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Coupon List",
                },
              ],
            },
            {
              key: "blogs",
              icon: <FaBloggerB className="fs-4" />,
              label: "Blogs",
              children: [
                {
                  key: "blog",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog",
                },
                {
                  key: "blog-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog List",
                },
                {
                  key: "blog-category",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog Category",
                },
                {
                  key: "blog-category-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog Category List",
                },
              ],
            },
            {
              key: "enquiries",
              icon: <FaClipboardList className="fs-4" />,
              label: "Enquiries",
            },
          ]}
        />
      </Sider>

      {/* Section principale du layout */}
      <Layout className="site-layout">
        {/* En-tête avec bouton de menu et profil utilisateur */}
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer, // Couleur de fond du thème
          }}
        >
          {/* 
            Bouton pour réduire/déplier le menu latéral
            Change d'icône selon l'état "collapsed"
          */}
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed), // Inverse l'état au clic
            }
          )}

          {/* Section droite de l'en-tête */}
          <div className="d-flex gap-4 align-items-center">
            {/* Badge de notifications */}
            <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3 {/* Nombre de notifications */}
              </span>
            </div>

            {/* Menu déroulant du profil utilisateur */}
            <div className="d-flex gap-3 align-items-center dropdown">
              {/* Photo de profil */}
              <div>
                <img
                  width={32}
                  height={32}
                  src="https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                  alt=""
                />
              </div>

              {/* Informations utilisateur (cliquable pour menu déroulant) */}
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">Ibrahima</h5>
                <p className="mb-0">seckibrahimadiagne@gmail.com</p>
              </div>

              {/* Menu déroulant */}
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    Signout
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>

        {/* Contenu principal de la page */}
        <Content
          style={{
            margin: "24px 16px", // Marge
            padding: 24, // Padding interne
            minHeight: 280, // Hauteur minimale
            background: colorBgContainer, // Couleur de fond
          }}
        >
          {/* 
            Container pour les notifications Toast
            - position="top-right" : position en haut à droite
            - autoClose={250} : fermeture automatique après 250ms
            - theme="light" : thème clair
          */}
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />

          {/* 
            Outlet : point d'insertion pour les routes enfants
            C'est ici que le contenu des pages spécifiques s'affichera
          */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
