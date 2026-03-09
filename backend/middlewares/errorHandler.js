// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware pour gérer les erreurs
const errorHandler = (err, req, res, next) => {
  // Déterminer le code d'état à renvoyer
  const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statuscode);
  
  // En production, ne pas envoyer la stack trace
  const response = {
    status: "fail",
    message: err?.message,
  };
  
  // Ajouter la stack trace uniquement en développement
  if (process.env.NODE_ENV === 'development') {
    response.stack = err?.stack;
  }
  
  res.json(response);
};

module.exports = { errorHandler, notFound };