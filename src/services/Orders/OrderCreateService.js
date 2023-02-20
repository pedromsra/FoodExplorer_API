class OrderCreateService {
    constructor(ordersRepository, orderCheckService, adressRepository, paymentsRepository, mealsRepository, adressCheckService, paymentsCheckService){
        this.ordersRepository = ordersRepository;
        this.orderCheckService = orderCheckService
        this.adressRepository = adressRepository;
        this.paymentsRepository = paymentsRepository;
        this.mealsRepository = mealsRepository;
        this.adressCheckService = adressCheckService;
        this.paymentsCheckService = paymentsCheckService;
    }

    async execute({user_id, adress, payment, meals}){

        const order = true;

        const {adress_id, payment_id} = await this.orderCheckService.check({user_id, order, adress, payment, meals})

        const value = await this.ordersRepository.calculateValue({meals, mealsRepository: this.mealsRepository});

        const order_id = await this.ordersRepository.createOrder({user_id, adress_id, payment_id, value});

        await this.ordersRepository.createOrderMeal({meals, order_id: order_id[0]})

        return order_id
    }
}

module.exports = OrderCreateService;