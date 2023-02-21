class OrderIndexService{
    constructor(orderRepository){
        this.orderRepository = orderRepository;
    }

    async execute({user_id}){
        if(!user_id){
            throw "É necessário estar autenticado para pedidos";
        }

        const orderList = await this.orderRepository.orderIndex({user_id});

        const mealsList = await this.orderRepository.mealsByOrder({orders: orderList})

        let meals
        let mealCount = 0

        const orders = orderList.map(order => {
            meals = mealsList[mealCount]
            mealCount++
            return {
                ...order,
                meals
            }
        })

        return orders
    }

}

module.exports = OrderIndexService;