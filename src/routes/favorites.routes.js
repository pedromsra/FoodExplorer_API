const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const favoritesController = new FavoritesController();

const favoritesRoutes = Router();

favoritesRoutes.use(ensureAuthenticated)

favoritesRoutes.post("/:meal_id", favoritesController.create);
favoritesRoutes.delete("/:meal_id", favoritesController.delete);
favoritesRoutes.get("/", favoritesController.index);
favoritesRoutes.get("/:meal_id", favoritesController.show);

module.exports = favoritesRoutes;