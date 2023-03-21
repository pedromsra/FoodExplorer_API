const { Router } = require("express");

const userRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const mealsRoutes = require("./meals.routes");
const favoritesRoutes = require("./favorites.routes");
const adressRoutes = require("./adress.routes");
const paymentsRoutes = require("./payments.routes");
const ordersRoutes = require("./orders.routes");

console.log("####################################")
console.log("####################################")
console.log("É necessário obter o clientID,")
console.log("clientSecret e os certificados")
console.log("na EFI (GerenciaNet)para conseguir")
console.log("usar a parte PIX dessa API")
console.log("####################################")
console.log("####################################")

const pixRoutes = require("./pix.routes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/meals", mealsRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/adress", adressRoutes);
routes.use("/payments", paymentsRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/pix", pixRoutes)

module.exports = routes;