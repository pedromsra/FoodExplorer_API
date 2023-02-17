class PaymentsShowService{
    constructor(paymentsRepository){
        this.paymentsRepository = paymentsRepository;
    }

    async execute({user_id, payment_id}){
        if(!user_id){
            throw "Você deve estar autenticado para cadastrar uma nova forma de pagamento";
        }

        const payment = await this.paymentsRepository.findByPaymentMethodId({payment_id});

        if(payment.user_id !== user_id){
            throw "acesso negado";
        }

        const myPayment = await this.paymentsRepository.show({payment_id});

        return myPayment;
    }
}

module.exports = PaymentsShowService