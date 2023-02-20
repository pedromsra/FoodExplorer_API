const { hash } = require("bcryptjs")

const knex = require("../database/knex");

class PaymentsRepository {
    async findPaymentByCardNumber({user_id, cardNumber}){
        const payment = await knex("savedPaymentMethod").where({user_id}).where({cardNumber}).first();
        if(cardNumber && !payment){
            const {defaultCardNumberLength} = await this.paymentsDefault()
            throw `Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`;
        }
        return payment;
    }

    async paymentsDefault(){
        const defaultCardNumberLength = 16;
        const defaultCscLength = 3

        return {defaultCardNumberLength, defaultCscLength}
    }

    async findByPaymentMethodId({payment_id}){
        const payment = await knex("savedPaymentMethod").where({id: payment_id}).first();
        if(!payment){
            throw "Forma de pagamento não encontrada"
        }
        return payment;
    }

    async create({user_id, cardName, cardNumber, cardExpiresIn, csc}){
        const hashedCsc = hash(csc, 8)

        const paymentCreated = await knex("savedPaymentMethod").insert({
            user_id,
            cardName,
            cardNumber,
            cardExpiresIn,
            csc: hashedCsc
        })

        return paymentCreated;
    }

    async update({payment_id, cardName, cardNumber, cardExpiresIn, csc}){
        const hashedCsc = hash(csc, 8)

        const paymentUpdated = await knex("savedPaymentMethod").where({id: payment_id}).update({
            cardName,
            cardNumber,
            cardExpiresIn,
            csc: hashedCsc,
            updated_at: knex.fn.now()
        })

        return paymentUpdated;
    }

    async index({user_id}) {
        const myPayments = await knex("savedPaymentMethod").where({user_id}).select("id", "cardName", "cardNumber", "cardExpiresIn", "updated_at");
        return myPayments;
    }

    async show({payment_id}){
        const myPayment = await knex("savedPaymentMethod").where({id: payment_id}).first().select("id", "cardName", "cardNumber", "cardExpiresIn", "updated_at");
        return myPayment;
    }

    async delete({payment_id}) {
        // await knex("savedPaymentMethod").where({id: payment_id}).delete();
        // return
    }
}

module.exports = PaymentsRepository;