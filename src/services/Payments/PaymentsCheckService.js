class PaymentsCheckService{
    constructor(paymentsRepository){
        this.paymentsRepository = paymentsRepository;
    }
    
    async check({user_id, order, payment_id, cardName, cardNumber, cardExpiresIn, csc, defaultCardNumberLength, defaultCscLength }){
        
        if(!user_id){
            throw "Você deve estar autenticado para cadastrar uma nova forma de pagamento";
        }

        if(!cardName) {
            throw "É necessário informar o nome que consta no cartão";
        }

        if(!cardNumber) {
            throw "É necessário informar o número do cartão";
        } else {
            if(cardNumber.length !== defaultCardNumberLength){
                throw `Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`;
            }

            const cardNumberCheck = await this.paymentsRepository.findPaymentByCardNumber({user_id, cardNumber})
            
            if(cardNumberCheck && cardNumberCheck.user_id === user_id && !order) {
                throw "Forma de pagamento já cadastrada"
            }
        }

        if(!cardExpiresIn) {
            throw "É necessário informar quando o cartão expira";
        }
        
        if(!csc) {
            throw "É necessário informar o código de segurança";
        } else {
            if(csc.length !== defaultCscLength){
                throw `Código de segurança inválido, o código deve conter ${defaultCscLength} dígitos`;
            }
        }

        if(payment_id){
            const payment = await this.paymentsRepository.findByPaymentMethodId({payment_id})
            
            if(payment.user_id !== user_id){
                throw "Acesso negado"
            }

            if(payment.id !== Number(payment_id) && !order){
                throw "Forma de pagamento já cadastrada"
            }

            return payment
        } else {
            
            const payment = await this.paymentsRepository.findPaymentByCardNumber({user_id, cardNumber});

            if(payment && !order){
                throw "Forma de pagamento já cadastrada"
            }
            return payment
        }
    }
}

module.exports = PaymentsCheckService;