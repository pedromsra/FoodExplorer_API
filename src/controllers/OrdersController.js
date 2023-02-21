const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const OrdersRepository = require("../repositories/OrdersRepository")
const AdressRepository = require("../repositories/AdressRepository")
const PaymentsRepository = require("../repositories/PaymentsRepository")
const MealsRepository = require("../repositories/MealsRepository")

const OrderCheckService = require("../services/Orders/OrderCheckService")
const AdressCheckService = require("../services/Adress/AdressCheckService")
const PaymentsCheckService = require("../services/Payments/PaymentsCheckService")

const OrderCreateService = require("../services/Orders/OrderCreateService")
const OrderUpdateService = require("../services/Orders/OrderUpdateService");
const OrderIndexService = require("../services/Orders/OrderIndexService");
const OrderShowService = require("../services/Orders/OrderShowService");

class OrdersController {
    async create(request, response){
        const { adress, payment, meals } = request.body
        
        const user_id = request.user.id;
        
        const adressRepository = new AdressRepository();
        const paymentsRepository = new PaymentsRepository();
        const mealsRepository = new MealsRepository();
        const adressCheckService = new AdressCheckService(adressRepository);
        const paymentsCheckService = new PaymentsCheckService(paymentsRepository);
        const ordersRepository = new OrdersRepository();
        const orderCheckService = new OrderCheckService(ordersRepository, adressRepository, paymentsRepository, adressCheckService, paymentsCheckService);

        const orderCreateService = new OrderCreateService(ordersRepository, orderCheckService, adressRepository, paymentsRepository, mealsRepository, adressCheckService, paymentsCheckService);

        try {
            await orderCreateService.execute({user_id, adress, payment, meals})
        } catch(e) {
            throw new AppError(e, 401)
        }

        return response.json()
    }

    async update(request, response){
        const { id } = request.params;

        const { adress, payment, meals, status } = request.body
        
        const user_id = request.user.id;

        const adressRepository = new AdressRepository();
        const paymentsRepository = new PaymentsRepository();
        const mealsRepository = new MealsRepository();
        const adressCheckService = new AdressCheckService(adressRepository);
        const paymentsCheckService = new PaymentsCheckService(paymentsRepository);
        const ordersRepository = new OrdersRepository();
        const orderCheckService = new OrderCheckService(ordersRepository, adressRepository, paymentsRepository, adressCheckService, paymentsCheckService);

        const orderUpdateService = new OrderUpdateService(ordersRepository, orderCheckService, adressRepository, paymentsRepository, mealsRepository, adressCheckService, paymentsCheckService);

        try {
            await orderUpdateService.execute({user_id, order_id: Number(id), adress, payment, meals, status})
        } catch(e) {
            throw new AppError(e, 401)
        }

        return response.json()
    }

    async index(request, response){
        const user_id = request.user.id;

        const ordersRepository = new OrdersRepository();

        const orderIndexService = new OrderIndexService(ordersRepository);

        try {
            const orders = await orderIndexService.execute({user_id})
            return response.json(orders)
        } catch(e) {
            throw new AppError(e, 401)
        }

    }

    async show(request, response){
        const { id } = request.params;    
        
        const user_id = request.user.id;

        const ordersRepository = new OrdersRepository();

        const orderShowService = new OrderShowService(ordersRepository);

        try {
            const myOrder = await orderShowService.execute({user_id, order_id: Number(id)})
            return response.json(myOrder)
        } catch(e) {
            throw new AppError(e, 401)
        }

    }

    async delete(request, response){
        // const { id } = request.params;    
        
        // const user_id = request.user.id;

        // if(!user_id){
        //     throw new AppError("É necessário estar autenticado para pedidos", 401)
        // }

        // await knex("orders").where({id}).delete();

        // return response.json()
    }
}

module.exports = OrdersController;