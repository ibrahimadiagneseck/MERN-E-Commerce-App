const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

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
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
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
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
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
