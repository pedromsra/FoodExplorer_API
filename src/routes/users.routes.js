const { Router } = require ("express");
const multer = require("multer");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const UsersController = require("../controllers/UsersController");

const UserAvatarController = require("../controllers/UserAvatarController");

const userRoutes = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

userRoutes.post("/", usersController.create);
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

userRoutes.put("/", ensureAuthenticated, usersController.update);
userRoutes.delete("/", ensureAuthenticated, usersController.delete);

module.exports = userRoutes;