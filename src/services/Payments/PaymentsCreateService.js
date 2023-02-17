const {hash} = require("bcryptjs");

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

        const hashedCsc = await hash(csc, 8);

        const paymentCreated = await this.paymentsRepository.create({user_id, cardName, cardNumber, cardExpiresIn, csc: hashedCsc})

        return paymentCreated
    }
}

module.exports = PaymentsCreateService;