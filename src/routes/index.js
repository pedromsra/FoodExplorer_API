const { Router } = require("express");

const userRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const mealsRoutes = require("./meals.routes");
const favoritesRoutes = require("./favorites.routes");
const adressRoutes = require("./adress.routes");
const paymentsRoutes = require("./payments.routes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/meals", mealsRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/adress", adressRoutes);
routes.use("/payments", paymentsRoutes);

module.exports = routes;