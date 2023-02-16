const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class SavedPaymentsController {
    async create (request, response) {
        const { cardName, cardNumber, cardExpiresIn, csc } = request.body;

        const user_id = request.user.id

        const defaultCardNumberLength = 16;

        const defaultCscLength = 3;

        if(!user_id){
            throw new AppError("Você deve estar autenticado para cadastrar uma nova forma de pagamento", 401)
        }

        if(!cardName) {
            throw new AppError("É necessário informar o nome que consta no cartão",401)
        }

        if(!cardNumber) {
            throw new AppError("É necessário informar o número do cartão",401)
        } else {
            if(cardNumber.length !== defaultCardNumberLength){
                throw new AppError(`Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`, 401)
            }
        }

        if(!cardExpiresIn) {
            throw new AppError("É necessário informar quando o cartão expira",401)
        }

        if(!csc) {
            throw new AppError("É necessário informar o código de segurança",401)
        } else {
            if(csc.length !== defaultCscLength){
                throw new AppError(`Código de segurança inválido, o código deve conter ${defaultCscLength} dígitos`, 401)
            }
        }

        await knex("savedPaymentMethod").insert({
            user_id,
            cardName,
            cardNumber,
            cardExpiresIn,
            csc
        })

        return response.json()
    }

    async update (request, response) {
        const { id } = request.params;

        const { cardName, cardNumber, cardExpiresIn, csc } = request.body;

        const user_id = request.user.id

        const defaultCardNumberLength = 16;

        const defaultCscLength = 3;

        if(!user_id){
            throw new AppError("Você deve estar autenticado para atualizar uma nova forma de pagamento", 401)
        }
        
        if(cardNumber) {
            if(cardNumber.length !== defaultCardNumberLength){
                throw new AppError(`Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`, 401)
            }
        }

        if(csc) {
            if(csc.length !== defaultCscLength){
                throw new AppError(`Código de segurança inválido, o código deve conter ${defaultCscLength} dígitos`, 401)
            }
        }

        const payment = await knex("savedPaymentMethod").where({id}).where({user_id}).first();

        payment.cardName = cardName ?? payment.cardName;
        payment.cardNumber = cardNumber ?? payment.cardNumber;
        payment.cardExpiresIn = cardExpiresIn ?? payment.cardExpiresIn;
        payment.csc = csc ?? payment.csc;

        await knex("savedPaymentMethod").where({id}).where({user_id}).update({
            cardName: payment.cardName,
            cardNumber: payment.cardNumber,
            cardExpiresIn: payment.cardExpiresIn,
            csc: payment.csc,
            updated_at: knex.fn.now()
        })

        return response.json()
    }

    async index (request, response) {
        const user_id = request.user.id

        if(!user_id){
            throw new AppError("Você deve estar autenticado para visualizar suas formas de pagamento", 401)
        }

        const myPayments = await knex("savedPaymentMethod").where({user_id}).select("id", "cardName", "cardNumber", "cardExpiresIn", "updated_at");

        return response.json(myPayments);
    }

    async show (request, response) {
        const { id } = request.params;

        const user_id = request.user.id

        if(!user_id){
            throw new AppError("Você deve estar autenticado para cadastrar uma nova forma de pagamento", 401)
        }

        const myPayment = await knex("savedPaymentMethod").where({id}).where({user_id}).first().select("id", "cardName", "cardNumber", "cardExpiresIn", "updated_at");

        return response.json(myPayment)
    }
    async delete (request, response) {
        const { id } = request.params;

        const user_id = request.user.id

        if(!user_id){
            throw new AppError("Você deve estar autenticado para cadastrar uma nova forma de pagamento", 401)
        }

        await knex("savedPaymentMethod").where({id}).where({user_id}).delete();

        return response.json()
    }
}

module.exports = SavedPaymentsController;