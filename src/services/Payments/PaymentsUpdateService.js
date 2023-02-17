const {hash} = require("bcryptjs");

const PaymentsCheckService = require("./PaymentsCheckService");

class PaymentsUpdateService{
    constructor(paymentsRepository){
        this.paymentsRepository = paymentsRepository;
    }

    async execute({user_id, payment_id, cardName, cardNumber, cardExpiresIn, csc}){
        const defaultCardNumberLength = 16;

        const defaultCscLength = 3;

        const paymentsCheckService = new PaymentsCheckService(this.paymentsRepository);
        
        const payment = await paymentsCheckService.check({user_id, payment_id, cardName, cardNumber, cardExpiresIn, csc, defaultCardNumberLength, defaultCscLength});
        console.log("oi")

        const hashedCsc = await hash(csc, 8);

        payment.cardName = cardName ?? payment.cardName;
        payment.cardNumber = cardNumber ?? payment.cardNumber;
        payment.cardExpiresIn = cardExpiresIn ?? payment.cardExpiresIn;
        payment.csc = hashedCsc ?? payment.csc;

        const paymentUpdated = await this.paymentsRepository.update({payment_id, cardName: payment.cardName, cardNumber: payment.cardNumber, cardExpiresIn: payment.cardExpiresIn, csc: payment.csc})

        return paymentUpdated
    }
}

module.exports = PaymentsUpdateService;