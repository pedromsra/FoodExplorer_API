const { Router } = require("express");

const AdressController = require("../controllers/AdressController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const adressRoutes = Router();

const adressController = new AdressController();

adressRoutes.use(ensureAuthenticated);

adressRoutes.post("/", adressController.create);
adressRoutes.get("/", adressController.index);
adressRoutes.get("/:id", adressController.show);
adressRoutes.put("/:id", adressController.update);
adressRoutes.delete("/:id", adressController.delete);

module.exports = adressRoutes;