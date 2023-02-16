const { Router } = require("express");

const SavedPaymentsController = require("../controllers/SavedPaymentController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const paymentsRoutes = Router();

const savedPaymentController = new SavedPaymentsController();

paymentsRoutes.use(ensureAuthenticated);

paymentsRoutes.post("/", savedPaymentController.create)
paymentsRoutes.put("/:id", savedPaymentController.update)
paymentsRoutes.get("/:id", savedPaymentController.show)
paymentsRoutes.get("/", savedPaymentController.index)
paymentsRoutes.delete("/:id", savedPaymentController.delete)

module.exports = paymentsRoutes;