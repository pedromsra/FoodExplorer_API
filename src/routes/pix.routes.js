const { Router } = require("express");

const PixController = require("../controllers/PixController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const pixRoutes = Router();

const pixController = new PixController();

pixRoutes.use(ensureAuthenticated);

pixRoutes.put("/", pixController.generateQrCode)
pixRoutes.post("/", pixController.generateCob)

module.exports = pixRoutes;