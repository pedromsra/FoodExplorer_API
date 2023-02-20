class OrderUpdateService{
    constructor(ordersRepository, orderCheckService, adressRepository, paymentsRepository, mealsRepository, adressCheckService, paymentsCheckService){
        this.ordersRepository = ordersRepository;
        this.orderCheckService = orderCheckService
        this.adressRepository = adressRepository;
        this.paymentsRepository = paymentsRepository;
        this.mealsRepository = mealsRepository;
        this.adressCheckService = adressCheckService;
        this.paymentsCheckService = paymentsCheckService;
    }
    
    async execute({user_id, order_id, adress, payment, meals, status}){

        const order = await this.ordersRepository.findOrderById({order_id});

        const {adress_id, payment_id} = await this.orderCheckService.check({user_id, order, adress, payment, meals})

        await this.ordersRepository.deleteOrderMeal({order_id});

        const value = await this.ordersRepository.calculateValue({meals, mealsRepository: this.mealsRepository});

        await this.ordersRepository.createOrderMeal({meals, order_id: order_id[0]})

        order.adress_id = adress_id ?? order.adress_id;
        order.payment_id = payment_id ?? order.payment_id;
        order.value = value ?? order.value;
        order.status = status ?? order.satatus;

        const orderUpdated = await this.ordersRepository.updateOrder({order_id, order});

        return orderUpdated;
    }
}

module.exports = OrderUpdateService;