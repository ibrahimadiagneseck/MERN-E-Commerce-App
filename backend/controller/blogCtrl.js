const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

const fs = require("fs");
const { rimraf, rimrafSync, native, nativeSync } = require('rimraf')



const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {

    // Récupère le blog par son ID et remplace les ID des utilisateurs par leurs informations complètes
    const getBlog = await Blog.findById(id)
      .populate("likes")     // Remplace chaque ID dans 'likes' par les documents complets des utilisateurs correspondants
      .populate("dislikes");  // Remplace chaque ID dans 'dislikes' par les documents complets des utilisateurs correspondants

    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// Handler pour aimer un blog
const liketheBlog = asyncHandler(async (req, res) => {
  // Récupération de l'ID du blog depuis la requête
  const { blogId } = req.body;
  // Validation de l'ID MongoDB du blog (vérifie si c'est un ID valide)
  validateMongoDbId(blogId);

  // Recherche du blog à partir de son ID
  const blog = await Blog.findById(blogId);

  // Récupération de l'ID de l'utilisateur connecté à partir de la requête
  const loginUserId = req?.user?._id;

  // Vérification si l'utilisateur a déjà aimé le blog
  const isLiked = blog?.isLiked;

  // Vérification si l'utilisateur a déjà disliké le blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // Vérification si l'utilisateur a déjà liké ou disliké le blog
  // const isLiked = blog?.likes?.some(
  //   (userId) => userId.toString() === loginUserId.toString()
  // );
  // const alreadyDisliked = blog?.dislikes?.some(
  //   (userId) => userId.toString() === loginUserId.toString()
  // );

  // Si l'utilisateur a déjà disliké le blog, retirer le dislike
  if (alreadyDisliked) {
    // Mise à jour du blog : suppression de l'utilisateur des dislikes et réinitialisation de `isDisliked`
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId }, // Retirer l'ID de l'utilisateur des dislikes
        isDisliked: false, // Le blog n'est plus disliké
      },
      { new: true } // Retourne le document mis à jour
    );
    // Réponse avec le blog mis à jour
    res.json(blog);
  }

  // Si le blog est déjà liké, retirer le like
  if (isLiked) {
    // Mise à jour du blog : suppression de l'utilisateur des likes et réinitialisation de `isLiked`
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId }, // Retirer l'ID de l'utilisateur des likes
        isLiked: false, // Le blog n'est plus liké
      },
      { new: true }
    );
    res.json(blog);
  } else {
    // Si le blog n'était pas encore liké, ajouter le like
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId }, // Ajouter l'ID de l'utilisateur aux likes
        isLiked: true, // Le blog est maintenant liké
      },
      { new: true }
    );
    res.json(blog);
  }
});

// Handler pour disliker un blog
const disliketheBlog = asyncHandler(async (req, res) => {
  // Récupération de l'ID du blog depuis la requête
  const { blogId } = req.body;
  // Validation de l'ID MongoDB du blog
  validateMongoDbId(blogId);

  // Recherche du blog à partir de son ID
  const blog = await Blog.findById(blogId);

  // Récupération de l'ID de l'utilisateur connecté
  const loginUserId = req?.user?._id;

  // Vérification si l'utilisateur a déjà disliké le blog
  const isDisLiked = blog?.isDisliked;

  // Vérification si l'utilisateur a déjà liké le blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // Si l'utilisateur a déjà liké le blog, retirer le like
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId }, // Retirer l'ID de l'utilisateur des likes
        isLiked: false, // Le blog n'est plus liké
      },
      { new: true }
    );
    res.json(blog);
  }

  // Si le blog est déjà disliké, retirer le dislike
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId }, // Retirer l'ID de l'utilisateur des dislikes
        isDisliked: false, // Le blog n'est plus disliké
      },
      { new: true }
    );
    res.json(blog);
  } else {
    // Si le blog n'était pas encore disliké, ajouter le dislike
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId }, // Ajouter l'ID de l'utilisateur aux dislikes
        isDisliked: true, // Le blog est maintenant disliké
      },
      { new: true }
    );
    res.json(blog);
  }
});


const uploadImages = asyncHandler(async (req, res) => {

  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    // const pathsToDelete = []; // Liste des chemins des fichiers à supprimer
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
      // pathsToDelete.push(path);

      // let formattedPath = path.replace(/\\/g, '\\\\');

      // Supprime le fichier local en utilisant deleteFileWithRetry
      // deleteFileWithRetry(path, 3, 5000); // Remove-Item .\images-1730476257385-137675023.jpeg -Force

    }

    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// Fonction pour supprimer un fichier avec des tentatives en cas d'échec initial:  car le fichier peut toujour etre en cours d'utilisation
// function deleteFileWithRetry(filePath, retryCount = 2, delay = 1000) {
//   if (fs.existsSync(filePath)) {
//     let attempts = 0;

//     // Fonction pour tenter de supprimer le fichier
//     const tryDelete = async () => {
//       attempts++;

//       rimraf(filePath, {
//         maxRetries: 5,
//         backoff: 1.5
//       })
//         .then(() => console.log('Fichier supprimé'))
//         .catch(err => console.error('Erreur lors de la suppression du fichier :', err));


//       //         rimraf(filePath, { preserveRoot: false })
//       // .then(() => console.log('Fichier supprimé'))
//       // .catch(err => console.error('Erreur lors de la suppression du fichier :', err));


//       // Utiliser rimraf pour supprimer le fichier : rimrafSync
//       // const result = await rimraf(filePath); // Utilisez rimraf avec await
//       // if (result) {
//       //     console.log(`Fichier supprimé : ${filePath}`);
//       // }
//     };

//     tryDelete(); // Lancer la première tentative
//   } else {
//     console.log(`Le fichier n'existe pas : ${filePath}`);
//   }
// }


// Fonction pour supprimer un fichier avec des tentatives en cas d'échec initial:  car le fichier peut toujour etre en cours d'utilisation
// function deleteFileWithRetry(filePath, retryCount = 2, delay = 1000) {

//   if (fs.existsSync(filePath)) {

//       let attempts = 0;

//       const tryDelete = () => {

//           attempts++;

//           try {

//             const fd = fs.openSync(filePath, 'r'); // Ouvre le fichier en lecture
//             fs.closeSync(fd); // Libère le verrou sur le fichier

//               // Tente de supprimer le fichier
//               fs.unlinkSync(filePath);
//               console.log(`Fichier supprimé : ${filePath}`);

//               // Fin de la tentative
//               return; // Retourner pour sortir de la fonction

//           } catch (unlinkError) {

//               if (attempts < retryCount) {
//                   console.log(`Tentative ${attempts} échouée. Nouveau test dans ${delay} ms...`);
//                   setTimeout(tryDelete, delay); // Attendre avant de réessayer
//               } else {
//                   console.error('Erreur lors de la suppression du fichier après plusieurs essais :', unlinkError);
//               }

//           }
//       };

//       tryDelete(); // Lancer la première tentative de suppression
//   } else {
//       console.log(`Le fichier n'existe pas : ${filePath}`);
//   }
// }




module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
};
