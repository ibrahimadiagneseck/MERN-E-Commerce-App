const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// S'assurer que les dossiers existent
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/images/images/");
    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Garder l'extension originale
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniquesuffix + (ext || ".jpeg"));
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Please upload an image."), false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Middleware pour redimensionner les images des produits
const productImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const productsDir = path.join(__dirname, "../public/images/products/");
        ensureDirExists(productsDir);

        // Générer un nouveau nom de fichier
        const filename = path.basename(file.filename, path.extname(file.filename)) + ".jpeg";
        const filePathResize = path.join(productsDir, filename);

        // Redimensionner l'image
        await sharp(file.path)
          .resize(800, 800, { 
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
        
        // Mettre à jour les informations du fichier
        file.path = filePathResize;
        file.filename = filename;
        file.destination = productsDir;
      })
    );
    next();
  } catch (error) {
    console.error("Error in productImgResize:", error);
    return res.status(500).json({ 
      status: "fail",
      message: "Error resizing product images",
      error: error.message 
    });
  }
};

// Middleware pour redimensionner les images des blogs
const blogImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const blogsDir = path.join(__dirname, "../public/images/blogs/");
        ensureDirExists(blogsDir);

        // Générer un nouveau nom de fichier
        const filename = path.basename(file.filename, path.extname(file.filename)) + ".jpeg";
        const filePathResize = path.join(blogsDir, filename);

        await sharp(file.path)
          .resize(1200, 800, { 
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
        
        // Mettre à jour les informations du fichier
        file.path = filePathResize;
        file.filename = filename;
        file.destination = blogsDir;
      })
    );
    next();
  } catch (error) {
    console.error("Error in blogImgResize:", error);
    return res.status(500).json({ 
      status: "fail",
      message: "Error resizing blog images",
      error: error.message 
    });
  }
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };