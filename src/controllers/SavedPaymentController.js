const AppError = require("../utils/AppError");

const {hash} = require("bcryptjs")

const PaymentsRepository = require("../repositories/PaymentsRepository");

const PaymentsCreateService = require("../services/Payments/PaymentsCreateService")
const PaymentsUpdateService = require("../services/Payments/PaymentsUpdateService")
const PaymentsShowService = require("../services/Payments/PaymentsShowService")
// const PaymentsDeleteService = require("../services/Payments/PaymentsDeleteService")

class SavedPaymentsController {
    async create (request, response) {
        const { cardName, cardNumber, cardExpiresIn, csc } = request.body;

        const user_id = request.user.id

        const paymentsRepository = new PaymentsRepository();

        const paymentsCreateService = new PaymentsCreateService(paymentsRepository);

        try {
            await paymentsCreateService.execute({user_id, cardName, cardNumber, cardExpiresIn, csc })
        } catch(e) {
            throw new AppError(e, 401)
        }

        return response.json()
    }

    async update (request, response) {
        const { id } = request.params;

        const { cardName, cardNumber, cardExpiresIn, csc } = request.body;

        const user_id = request.user.id

        const paymentsRepository = new PaymentsRepository();

        const paymentsUpdateService = new PaymentsUpdateService(paymentsRepository);

        try {
            await paymentsUpdateService.execute({user_id, payment_id: id, cardName, cardNumber, cardExpiresIn, csc})
        } catch(e) {
            throw new AppError(e, 401);
        }

        return response.json()
    }

    async index (request, response) {
        const user_id = request.user.id

        const paymentsRepository = new PaymentsRepository();

        if(!user_id){
            throw new AppError("Você deve estar autenticado para visualizar suas formas de pagamento", 401)
        }

        const myPayments = await paymentsRepository.index({user_id})

        return response.json(myPayments);
    }

    async show (request, response) {
        const { id } = request.params;

        const user_id = request.user.id

        const paymentsRepository = new PaymentsRepository();

        const paymentsShowService = new PaymentsShowService(paymentsRepository);

        try {
            const myPayment = await paymentsShowService.execute({user_id, payment_id: id});
            return response.json(myPayment)
        } catch (e) {
            throw new AppError(e, 401)
        }

    }

    async delete (request, response) {
        // Deletition will not work, just to maitain the Orders database, i can, in another moment, add something like a copy of a key_word or something like that, to be possible to delete.
        // const { id } = request.params;

        // const user_id = request.user.id;

        // const paymentsRepository = new PaymentsRepository();

        // if(!user_id){
        //     throw new AppError("Você deve estar autenticado para cadastrar uma nova forma de pagamento", 401)
        // }

        // await knex("savedPaymentMethod").delete();

        // return response.json()
    }
}

module.exports = SavedPaymentsController;