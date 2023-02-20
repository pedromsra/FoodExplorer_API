const PaymentsCheckService = require("./PaymentsCheckService");

class PaymentsCreateService{
    constructor(paymentsRepository){
        this.paymentsRepository = paymentsRepository;
    }

    async execute({user_id, cardName, cardNumber, cardExpiresIn, csc }){
        const defaultCardNumberLength = 16;

        const defaultCscLength = 3;

        const paymentsCheckService = new PaymentsCheckService(this.paymentsRepository);

        await paymentsCheckService.check({user_id, cardName, cardNumber, cardExpiresIn, csc, defaultCardNumberLength, defaultCscLength});

        const paymentCreated = await this.paymentsRepository.create({user_id, cardName, cardNumber, cardExpiresIn, csc})

        return paymentCreated
    }
}

module.exports = PaymentsCreateService;