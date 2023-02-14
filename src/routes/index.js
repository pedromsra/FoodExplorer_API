const { Router } = require("express");

const userRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const mealsRoutes = require("./meals.routes");
const favoritesRoutes = require("./favorites.routes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/meals", mealsRoutes);
routes.use("/favorites", favoritesRoutes);

module.exports = routes;