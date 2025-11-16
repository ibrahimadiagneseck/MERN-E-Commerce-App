const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1MB
});

// Middleware pour redimensionner les images des produits
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        // Créer le dossier s'il n'existe pas
        const productsDir = path.join(__dirname, "../public/images/products/");
        if (!fs.existsSync(productsDir)) {
          fs.mkdirSync(productsDir, { recursive: true });
        }

        const filePathResize = path.join(productsDir, file.filename);

        // Redimensionner SANS déformation - conserver le ratio
        await sharp(file.path)
          .resize(800, 800, { // Taille maximale plus grande
            fit: 'inside',
            withoutEnlargement: true // Ne pas agrandir les images plus petites
          })
          .toFormat("jpeg")
          .jpeg({ 
            quality: 85, // Qualité légèrement réduite pour optimisation
            mozjpeg: true // Compression optimisée
          })
          .toFile(filePathResize);

        // Supprimer le fichier original
        fs.unlinkSync(file.path);
        
        // Mettre à jour le chemin pour Cloudinary
        file.path = filePathResize;
      })
    );
    next();
  } catch (error) {
    console.error("Error in productImgResize:", error);
    return res.status(500).json({ message: "Error resizing product images" });
  }
};

// Middleware pour redimensionner les images des blogs
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        // CORRECTION : Déclarer filePathResize correctement
        const blogsDir = path.join(__dirname, "../public/images/blogs/");
        if (!fs.existsSync(blogsDir)) {
          fs.mkdirSync(blogsDir, { recursive: true });
        }

        const filePathResize = path.join(blogsDir, file.filename);

        await sharp(file.path)
          .resize(1200, 800, { // Format plus adapté pour les blogs
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat("jpeg")
          .jpeg({ 
            quality: 85,
            mozjpeg: true 
          })
          .toFile(filePathResize);

        // Supprimer le fichier original
        fs.unlinkSync(file.path);
        
        // Mettre à jour le chemin pour Cloudinary
        file.path = filePathResize;
      })
    );
    next();
  } catch (error) {
    console.error("Error in blogImgResize:", error);
    return res.status(500).json({ message: "Error resizing blog images" });
  }
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };









// const multer = require("multer"); // Importer la bibliothèque multer pour la gestion des fichiers téléchargés
// const sharp = require("sharp"); // Importer sharp pour le traitement des images
// const path = require("path"); // Importer path pour travailler avec les chemins de fichiers
// // const fs = require("fs"); // Importer le système de fichiers pour manipuler les fichiers
// // const { log } = require("console");

// // Configuration du stockage pour multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Définir le dossier de destination pour les fichiers téléchargés
//     cb(null, path.join(__dirname, "../public/images/images/")); // Dossier de destination
//     // cb(null, "public/images/images/"); // Dossier de destination
//   },
//   filename: function (req, file, cb) {
//     // Définir le nom de fichier à utiliser lors de la sauvegarde
//     const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Générer un suffixe unique basé sur l'heure actuelle
//     cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg"); // Nommer le fichier avec le champ et le suffixe
//   },
// });

// // Filtre pour vérifier le type de fichier
// const multerFilter = (req, file, cb) => {
//   // Vérifier si le fichier est une image
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true); // Si c'est une image, permettre le téléchargement
//   } else {
//     cb({ message: "Unsupported file format" }, false); // Sinon, retourner une erreur
//   }
// };

// // Configuration de multer pour le téléchargement des photos
// const uploadPhoto = multer({
//   storage: storage, // Utiliser le stockage défini ci-dessus
//   fileFilter: multerFilter, // Utiliser le filtre défini ci-dessus
//   limits: { fileSize: 1000000 }, // Limite de taille de fichier (1 Mo)
// });

// // Middleware pour redimensionner les images des produits
// const productImgResize = async (req, res, next) => {

//   // Vérifier s'il n'y a pas de fichiers téléchargés
//   if (!req.files) return next(); // Passer au middleware suivant si aucun fichier

//   // Redimensionner chaque image et sauvegarder temporairement
//   await Promise.all(req.files.map(async (file) => {

//       const filePathResize = `public/images/products/${file.filename}`;

//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(filePathResize); // Sauvegarder le fichier redimensionné

        
//       // Supprimer le fichier d'origine avant redimensionnement
//       // fs.unlinkSync(file.path);
//       // -----------------------------------------------------------------
//       // fs.unlink(file.path, (err) => {
//       //   if (err) console.error("Erreur lors de la suppression du fichier :", err);
//       // });


//       // Mettre à jour le chemin du fichier pour qu'il pointe vers le fichier redimensionné, pour cloudinaryUploadImg
//       file.path = filePathResize;

//     })
//   );


//   next(); // Passer au middleware suivant (uploadImages)
// };

// // Middleware pour redimensionner les images des blogs
// const blogImgResize = async (req, res, next) => {

//   // Vérifier s'il n'y a pas de fichiers téléchargés
//   if (!req.files) return next(); // Passer au middleware suivant si aucun fichier

//   const filePathResize = `public/images/blogs/${file.filename}`;

//   // Traiter chaque fichier téléchargé
//   await Promise.all(req.files.map(async (file) => {

//       await sharp(file.path) // Utiliser sharp pour redimensionner l'image
//         .resize(300, 300) // Redimensionner l'image à 300x300 pixels
//         .toFormat("jpeg") // Convertir en format JPEG
//         .jpeg({ quality: 90 }) // Définir la qualité à 90%
//         .toFile(filePathResize); // Sauvegarder le fichier redimensionné

//       // Supprimer le fichier d'origine avant redimensionnement
//       // fs.unlinkSync(file.path);
//       // -----------------------------------------------------------------
//       // fs.unlink(file.path, (err) => {
//       //   if (err) console.error("Erreur lors de la suppression du fichier :", err);
//       // });


//         // Mettre à jour le chemin du fichier pour qu'il pointe vers le fichier redimensionné, pour cloudinaryUploadImg
//       file.path = filePathResize;
//     })
//   );
//   next(); // Passer au middleware suivant
// };


// // Exporter les fonctions pour les utiliser dans d'autres fichiers
// module.exports = { uploadPhoto, productImgResize, blogImgResize }; // Exporter les middlewares
