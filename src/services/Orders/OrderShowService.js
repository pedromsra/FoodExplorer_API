class OrderShowService{
    constructor(orderRepository){
        this.orderRepository = orderRepository;
    }

    async execute({user_id, order_id}){
        if(!user_id){
            throw "É necessário estar autenticado para pedidos";
        }

        const orderSearch = await this.orderRepository.orderShow({order_id});

        let meals = await this.orderRepository.mealByOrder({order_id})

        const myOrder = {
                ...orderSearch,
                meals
        }

        return myOrder
    }
}

module.exports = OrderShowService;