const knex = require("../database/knex");

class OrdersRepository{
    async findOrderById({order_id}){
        const order = await knex("orders").where({id: order_id}).first();
        return order;
    }

    async createOrder({user_id, adress_id, payment_id, value}){
        const orderId = await knex("orders").insert({
            user_id,
            adress_id,
            payment_id,
            value
        })

        return orderId
    }

    async updateOrder({order_id, order}){
        const orderUpdated = await knex("orders").where({id: order_id}).update({
            adress_id: order.adress_id,
            payment_id: order.payment_id,
            value: order.value,
            status: order.status
        })
        
        return orderUpdated;
    }

    async calculateValue({meals, mealsRepository}){

        let mealsFromTable = [];
        let valueCalculated = 0;
        
        for(let meal = 0; meal < meals.length; meal++){
            mealsFromTable[meal] = await mealsRepository.findMealById({meal_id: meals[meal].meal_id})
            valueCalculated = Number(valueCalculated) + Number(mealsFromTable[meal].price)*Number(meals[meal].quantity);
        }

        const value = Number(parseFloat(String(valueCalculated)).toFixed(2))

        return value;
    }

    async createOrderMeal({meals, order_id}){
        for(let meal = 0; meal < meals.length; meal++){
            await knex("orderMeal").insert({
                meal_id: meals[meal].meal_id,
                quantity: meals[meal].quantity,
                order_id
            })
        }

        return
    }

    async deleteOrderMeal({order_id}){
        await knex("orderMeal").where({order_id}).delete()
    }


    async orderIndex({user_id}){
        const orderList = await knex("orders")
            .where({user_id})
            .select("id", "status", "updated_at", "value")

        return orderList;
    }

    async mealsByOrder({orders}){
        let mealsList = [];

        for(let order = 0; order < orders.length; order++){
            mealsList[order] = await knex("orderMeal")
                .join("orders", "orders.id", "orderMeal.order_id")
                .join("meals", "meals.id", "orderMeal.meal_id")
                .select("meals.title", "orderMeal.quantity")
                .where("orders.id", orders[order].id)
        }

        return mealsList
    }

    async orderShow({order_id}){
        const orderSearch = await knex("orders")
            .where({id: order_id})
            .first()
            .select("id", "status", "updated_at", "value")

        return orderSearch
    }

    async mealByOrder({order_id}){
        const meal = await knex("orderMeal")
        .join("orders", "orders.id", "orderMeal.order_id")
        .join("meals", "meals.id", "orderMeal.meal_id")
        .select("meals.title", "meals.price", "orderMeal.quantity")
        .where("orders.id", order_id)

        return meal
    }
}

module.exports = OrdersRepository;