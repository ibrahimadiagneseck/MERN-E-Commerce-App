const multer = require("multer"); // Importer la bibliothèque multer pour la gestion des fichiers téléchargés
const sharp = require("sharp"); // Importer sharp pour le traitement des images
const path = require("path"); // Importer path pour travailler avec les chemins de fichiers
const fs = require("fs"); // Importer le système de fichiers pour manipuler les fichiers

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Définir le dossier de destination pour les fichiers téléchargés
    cb(null, path.join(__dirname, "../public/images/")); // Dossier de destination
  },
  filename: function (req, file, cb) {
    // Définir le nom de fichier à utiliser lors de la sauvegarde
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Générer un suffixe unique basé sur l'heure actuelle
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg"); // Nommer le fichier avec le champ et le suffixe
  },
});

// Filtre pour vérifier le type de fichier
const multerFilter = (req, file, cb) => {
  // Vérifier si le fichier est une image
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Si c'est une image, permettre le téléchargement
  } else {
    cb({ message: "Unsupported file format" }, false); // Sinon, retourner une erreur
  }
};

// Configuration de multer pour le téléchargement des photos
const uploadPhoto = multer({
  storage: storage, // Utiliser le stockage défini ci-dessus
  fileFilter: multerFilter, // Utiliser le filtre défini ci-dessus
  limits: { fileSize: 1000000 }, // Limite de taille de fichier (1 Mo)
});

// Middleware pour redimensionner les images des produits
const productImgResize = async (req, res, next) => {
  // Vérifier s'il n'y a pas de fichiers téléchargés
  if (!req.files) return next(); // Passer au middleware suivant si aucun fichier

  // Traiter chaque fichier téléchargé
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path) // Utiliser sharp pour redimensionner l'image
        .resize(300, 300) // Redimensionner l'image à 300x300 pixels
        .toFormat("jpeg") // Convertir en format JPEG
        .jpeg({ quality: 90 }) // Définir la qualité à 90%
        .toFile(`public/images/products/${file.filename}`); // Sauvegarder le fichier redimensionné

      fs.unlinkSync(`public/images/products/${file.filename}`); // Supprimer l'image d'origine pour libérer de l'espace
    })
  );
  next(); // Passer au middleware suivant
};

// Middleware pour redimensionner les images des blogs
const blogImgResize = async (req, res, next) => {
  // Vérifier s'il n'y a pas de fichiers téléchargés
  if (!req.files) return next(); // Passer au middleware suivant si aucun fichier

  // Traiter chaque fichier téléchargé
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path) // Utiliser sharp pour redimensionner l'image
        .resize(300, 300) // Redimensionner l'image à 300x300 pixels
        .toFormat("jpeg") // Convertir en format JPEG
        .jpeg({ quality: 90 }) // Définir la qualité à 90%
        .toFile(`public/images/blogs/${file.filename}`); // Sauvegarder le fichier redimensionné

      fs.unlinkSync(`public/images/blogs/${file.filename}`); // Supprimer l'image d'origine pour libérer de l'espace
    })
  );
  next(); // Passer au middleware suivant
};

// Exporter les fonctions pour les utiliser dans d'autres fichiers
module.exports = { uploadPhoto, productImgResize, blogImgResize }; // Exporter les middlewares
