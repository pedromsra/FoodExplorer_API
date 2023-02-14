const { Router } = require("express");
const multer = require("multer");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const MealsController = require("../controllers/MealsController");

const MealsImageController = require("../controllers/MealsImageController");

const mealsRoutes = Router();

const mealsController = new MealsController();

const mealsImageController = new MealsImageController();

const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.post("/", mealsController.create);
mealsRoutes.patch("/:id/image", ensureAuthenticated, upload.single("image"), mealsImageController.update);
mealsRoutes.put("/:id", mealsController.update);
mealsRoutes.get("/", mealsController.index);
mealsRoutes.get("/:id", mealsController.show)
mealsRoutes.delete("/:id", mealsController.delete)

module.exports = mealsRoutes;