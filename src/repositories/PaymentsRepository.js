const knex = require("../database/knex");

class PaymentsRepository {
    async findPaymentByCardNumber({user_id, cardNumber}){
        const payment = await knex("savedPaymentMethod").where({user_id}).where({cardNumber}).first();
        return payment;
    }

    async findByPaymentMethodId({payment_id}){
        const payment = await knex("savedPaymentMethod").where({id: payment_id}).first();
        if(!payment){
            throw "Forma de pagamento não encontrada"
        }
        return payment;
    }

    async create({user_id, cardName, cardNumber, cardExpiresIn, csc}){
        const paymentCreated = await knex("savedPaymentMethod").insert({
            user_id,
            cardName,
            cardNumber,
            cardExpiresIn,
            csc
        })

        return paymentCreated;
    }

    async update({payment_id, cardName, cardNumber, cardExpiresIn, csc}){
        const paymentUpdated = await knex("savedPaymentMethod").where({id: payment_id}).update({
            cardName,
            cardNumber,
            cardExpiresIn,
            csc,
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