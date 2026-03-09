// src/data/data.js
// Toutes les données centralisées et formatées : { title, tagline, image }

import service from "../images/service.png";
import service2 from "../images/service-02.png";
import service3 from "../images/service-03.png";
import service4 from "../images/service-04.png";
import service5 from "../images/service-05.png";

import camera from "../images/camera.jpg";
import tv from "../images/tv.jpg";
import watch from "../images/watch.jpg";
import headphone from "../images/headphone.jpg";

import mainBanner1 from "../images/main-banner-1.jpg";
import catbanner1 from "../images/catbanner-01.jpg";
import catbanner2 from "../images/catbanner-02.jpg";
import catbanner3 from "../images/catbanner-03.jpg";
import catbanner4 from "../images/catbanner-04.jpg";

import brand1 from "../images/brand-01.png";
import brand2 from "../images/brand-02.png";
import brand3 from "../images/brand-03.png";
import brand4 from "../images/brand-04.png";
import brand5 from "../images/brand-05.png";
import brand6 from "../images/brand-06.png";
import brand7 from "../images/brand-07.png";
import brand8 from "../images/brand-08.png";

import img1 from "../images/image-1.jpg";
import img2 from "../images/image-2.jpg";

// ---------------- SERVICES ----------------
export const services = [
  { title: "Free Shipping", tagline: "From all orders over $5", image: service },
  { title: "Daily Surprise Offers", tagline: "Save up to 25%", image: service2 },
  { title: "Support 24/7", tagline: "Shop with an expert", image: service3 },
  { title: "Affordable Prices", tagline: "Factory default prices", image: service4 },
  { title: "Secure Payments", tagline: "100% Protected payments", image: service5 },
];

// ---------------- CATEGORIES ----------------
// Respect de l'ordre { title, tagline, image }
export const categories = [
  { title: "Cameras", tagline: "10 Items", image: camera },
  { title: "Smart TV", tagline: "10 Items", image: tv },
  { title: "Smart Watches", tagline: "10 Items", image: watch },
  { title: "Music & Gaming", tagline: "10 Items", image: headphone },
];

// ---------------- MAIN BANNER ----------------
export const mainBanner = {
  title: "iPad S13+ Pro.",
  tagline: "From $999.00 <br /> or $41.62/mo.",
  image: mainBanner1,
};

// ---------------- SMALL BANNERS ----------------
export const smallBanners = [
  { title: "iPad S13+ Pro.", tagline: "From $999.00 <br /> or $41.62/mo.", image: catbanner1 },
  { title: "Buy iPad Air", tagline: "From $999.00 <br /> or $41.62/mo.", image: catbanner2 },
  { title: "Buy iPad Air", tagline: "From $999.00 <br /> or $41.62/mo.", image: catbanner3 },
  { title: "Buy iPad Air", tagline: "From $999.00 <br /> or $41.62/mo.", image: catbanner4 },
];

// ---------------- BRANDS ----------------
// Ici on garde la structure uniforme : { title, tagline, image } (tagline laissé vide si non nécessaire)
export const brands = [
  { title: "brand-01", tagline: "", image: brand1 },
  { title: "brand-02", tagline: "", image: brand2 },
  { title: "brand-03", tagline: "", image: brand3 },
  { title: "brand-04", tagline: "", image: brand4 },
  { title: "brand-05", tagline: "", image: brand5 },
  { title: "brand-06", tagline: "", image: brand6 },
  { title: "brand-07", tagline: "", image: brand7 },
  { title: "brand-08", tagline: "", image: brand8 },
];

// ---------------- FAMOUS / FEATURE CARDS ----------------
export const famousProducts = [
  { title: "Big Screen", tagline: "Smart Watch Series 7 — From $399 $16.62/mo.*", image: img1 },
  { title: "Studio Display", tagline: "600 nits of brightness — 27-inch 5k Retina display", image: img2 },
  { title: "Smartphones", tagline: "Smartphones 13 Pro — From $999.00 or $41.62/mo.", image: img2 },
  { title: "Home Speakers", tagline: "Room filling sound — From $699 or $116.58/mo.", image: img2 },
];
