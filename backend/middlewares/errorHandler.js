// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
  // Créer une nouvelle erreur avec un message indiquant que la ressource n'a pas été trouvée
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404); // Définir le code d'état de la réponse à 404 (non trouvé)
  next(error); // Passer l'erreur au middleware d'erreur suivant
};

// Middleware pour gérer les erreurs
const errorHandler = (err, req, res, next) => {
  // Déterminer le code d'état à renvoyer : 500 si le code actuel est 200, sinon utiliser le code d'état actuel
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode); // Définir le code d'état de la réponse
  res.json({
    status: "fail", // Indiquer que la requête a échoué
    message: err?.message, // Inclure le message d'erreur (s'il existe)
    stack: err?.stack, // Inclure la pile d'appels (pour le débogage, s'il existe)
  });
};

// Exporter les middlewares pour être utilisés dans d'autres fichiers
module.exports = { errorHandler, notFound }; // Exporter les middlewares
