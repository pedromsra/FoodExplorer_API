class OrderCheckService{
    constructor(ordersRepository, adressRepository, paymentsRepository, adressCheckService, paymentsCheckService){
        this.ordersRepository = ordersRepository;
        this.adressRepository = adressRepository;
        this.adressCheckService = adressCheckService;
        this.paymentsRepository = paymentsRepository;
        this.paymentsCheckService = paymentsCheckService;
    }

    async check({user_id, order_id, order, adress, payment, meals}){

        if(!user_id){
            throw "É necessário estar autenticado para criar pedidos";
        }

        if(!adress){
            throw "É necessário informar o endereço de destino";
        }

        if(!payment){
            throw "É necessário informar forma de pagamento"
        }

        if(!meals){
            throw "É necessário informar as refeições do pedido";
        }

        if(order_id){
            const checkOrder = await this.ordersRepository.findOrderById({order_id})

            if(checkOrder && checkOrder.user_id !== user_id){
                throw "Acesso negado"
            }
        }

        const myAdress = await this.adressRepository.findByCepAndNumber({user_id, cep: adress.cep, number: adress.number});

        const checkAdress = await this.adressCheckService.check({user_id, order, adress_id: myAdress.id, cep: adress.cep, number: adress.number, streetName:adress.streetName, city: adress.city})

        let adress_id
        
        if(!checkAdress){
            adress_id = await this.adressRepository.create({user_id, nickname: adress.nickname, cep: adress.cep, number: adress.number, streetName: adress.streetName, city: adress.city})
        } else {
            adress_id = checkAdress.id;
        }

        const myPayment = await this.paymentsRepository.findPaymentByCardNumber({user_id, cardNumber: payment.cardNumber})

        const paymentDefault = await this.paymentsRepository.paymentsDefault();
        
        const checkPayment = await this.paymentsCheckService.check({user_id, order, payment_id: myPayment.id, cardName: payment.cardName, cardNumber: payment.cardNumber, cardExpiresIn: payment.cardExpiresIn, csc: payment.csc, defaultCardNumberLength: paymentDefault.defaultCardNumberLength, defaultCscLength: paymentDefault.defaultCscLength })
        
        let payment_id
        
        if(!checkPayment){
            payment_id = await this.paymentsRepository.create({user_id, cardName: payment.cardName, cardNumber: payment.cardNumber, cardExpiresIn: payment.cardExpiresIn, csc: payment.csc})
        } else {
            payment_id = checkPayment.id;
        }

        return {payment_id, adress_id}
    }
}

module.exports = OrderCheckService