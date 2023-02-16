const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class OrdersController {
    async create(request, response){
        const { adress, payment, meals } = request.body
        
        const user_id = request.user.id;

        
        if(!user_id){
            throw new AppError("É necessário estar autenticado para criar pedidos", 401)
        }

        if(!adress){
            throw new AppError("É necessário informar o endereço de destino", 401)
        } else {
            if(!adress.cep){
                throw new AppError("O campo CEP é obrigatório", 401);
            } else {
                const checkCep = adress.cep.split("-");
                if(checkCep.length !== 2 || checkCep[0].length !== 5 || checkCep[1].length !== 3){
                    throw new AppError("O CEP deve conter 5 dígitos e 3 dígitos, separado por hífen, no formato: 12345-123")
                }
            }
            
            if(!adress.number){
                throw new AppError("O campo número é obrigatório", 401);
            }
            
            if(!adress.streetName){
                throw new AppError("O campo rua é obrigatório", 401)
            }
            
            if(!adress.city){
                throw new AppError("O campo cidade é obrigatório", 401)
            }
        }

        const checkAdress = await knex("adress").where({user_id}).where({cep: adress.cep}).where({number: adress.number}).first();
        let adress_id
        
        if(!checkAdress){
            adress_id = await knex("adress").insert({
                user_id,
                nickname: adress.nickname,
                cep: adress.cep,
                number: adress.number,
                streetName: adress.setreetName,
                city: adress.city
            })
        } else {
            adress_id = checkAdress.id;
        }
        
        if(payment){
            
            const defaultCardNumberLength = 16;
            
            const defaultCscLength = 3;
            
            if(!payment.cardName) {
                throw new AppError("É necessário informar o nome que consta no cartão",401)
            }
            
            if(!payment.cardNumber) {
                throw new AppError("É necessário informar o número do cartão",401)
            } else {
                if(payment.cardNumber.length !== defaultCardNumberLength){
                    throw new AppError(`Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`, 401)
                }
            }
            
            if(!payment.cardExpiresIn) {
                throw new AppError("É necessário informar quando o cartão expira",401)
            }
    
            if(!payment.csc) {
                throw new AppError("É necessário informar o código de segurança",401)
            } else {
                if(payment.csc.length !== defaultCscLength){
                    throw new AppError(`Código de segurança inválido, o código deve conter ${defaultCscLength} dígitos`, 401);
                }
            }
            
        }

        const checkPayment = await knex("savedPaymentMethod").where({user_id}).where({cardNumber: payment.cardNumber}).first();
        let payment_id

        if(!checkPayment){
            const hashedCsc = await hash(payment.csc, 8);
            
            payment_id = await knex("savedPaymentMethod").insert({
                user_id,
                cardName: payment.cardName,
                cardNumber: payment.cardNumber,
                cardExpiresIn: payment.cardExpiresIn,
                csc: hashedCsc
            });
        } else {
            payment_id = checkPayment.id;
        }
        


        if(!meals){
            throw new AppError("É necessário informar as refeições do pedido", 401);
        }

        let mealsFromTable = [];
        let valueCalculated = 0;

        for(let meal = 0; meal < meals.length; meal++){
            mealsFromTable[meal] = await knex("meals").where({id: meals[meal].meal_id}).first();
            valueCalculated = Number(valueCalculated) + Number(mealsFromTable[meal].price)*Number(meals[meal].quantity);
        }

        const value = Number(parseFloat(String(valueCalculated)).toFixed(2))

        const order_id = await knex("orders").insert({
            user_id,
            adress_id,
            payment_id,
            value
        })

        for(let meal = 0; meal < meals.length; meal++){
            await knex("orderMeal").insert({
                meal_id: meals[meal].meal_id,
                quantity: meals[meal].quantity,
                order_id
            })
        }

        return response.json(order_id)
    }

    async update(request, response){
        const { id } = request.params;

        const { adress, payment, meals, status } = request.body
        
        const user_id = request.user.id;

        
        if(!user_id){
            throw new AppError("É necessário estar autenticado para alterar seus pedidos", 401)
        }

        const order = await knex("orders").where({id}).first();

        let checkAdress
        let adress_id

        if(adress){
            if(!adress.cep){
                throw new AppError("O campo CEP é obrigatório", 401);
            } else {
                const checkCep = adress.cep.split("-");
                if(checkCep.length !== 2 || checkCep[0].length !== 5 || checkCep[1].length !== 3){
                    throw new AppError("O CEP deve conter 5 dígitos e 3 dígitos, separado por hífen, no formato: 12345-123")
                }
            }
            
            if(!adress.number){
                throw new AppError("O campo número é obrigatório", 401);
            }
            
            if(!adress.streetName){
                throw new AppError("O campo rua é obrigatório", 401)
            }
            
            if(!adress.city){
                throw new AppError("O campo cidade é obrigatório", 401)
            }

            checkAdress = await knex("adress").where({user_id}).where({cep: adress.cep}).where({number: adress.number}).first();

            if(!checkAdress){
                adress_id = await knex("adress").insert({
                    user_id,
                    nickname: adress.nickname,
                    cep: adress.cep,
                    number: adress.number,
                    streetName: adress.setreetName,
                    city: adress.city
                })
            } else {
                adress_id = checkAdress.id;
            }
        }

        let checkPayment;
        let payment_id;
        
        if(payment){
            
            const defaultCardNumberLength = 16;
            
            const defaultCscLength = 3;
            
            if(!payment.cardName) {
                throw new AppError("É necessário informar o nome que consta no cartão",401)
            }
            
            if(!payment.cardNumber) {
                throw new AppError("É necessário informar o número do cartão",401)
            } else {
                if(payment.cardNumber.length !== defaultCardNumberLength){
                    throw new AppError(`Número de cartão inválido, o número deve conter ${defaultCardNumberLength} dígitos`, 401)
                }
            }
            
            if(!payment.cardExpiresIn) {
                throw new AppError("É necessário informar quando o cartão expira",401)
            }
    
            if(!payment.csc) {
                throw new AppError("É necessário informar o código de segurança",401)
            } else {
                if(payment.csc.length !== defaultCscLength){
                    throw new AppError(`Código de segurança inválido, o código deve conter ${defaultCscLength} dígitos`, 401);
                }
            }

            checkPayment = await knex("savedPaymentMethod").where({user_id}).where({cardNumber: payment.cardNumber}).where({cardName: payment.cardName}).first();
    
            if(!checkPayment){
                const hashedCsc = await hash(payment.csc, 8);
                
                payment_id = await knex("savedPaymentMethod").insert({
                    user_id,
                    cardName: payment.cardName,
                    cardNumber: payment.cardNumber,
                    cardExpiresIn: payment.cardExpiresIn,
                    csc: hashedCsc
                });
            } else {
                payment_id = checkPayment.id;
            }
        }

        let mealsFromTable = [];
        let valueCalculated = 0;
        let value;

        if(meals){
            await knex("orderMeal").where({order_id: id}).delete()

            for(let meal = 0; meal < meals.length; meal++){
                mealsFromTable[meal] = await knex("meals").where({id: meals[meal].meal_id}).first();
                valueCalculated = Number(valueCalculated) + Number(mealsFromTable[meal].price)*Number(meals[meal].quantity);
            }
    
            value = Number(parseFloat(String(valueCalculated)).toFixed(2))

            for(let meal = 0; meal < meals.length; meal++){
                await knex("orderMeal").insert({
                    meal_id: meals[meal].meal_id,
                    quantity: meals[meal].quantity,
                    order_id: id
                })
            }
        }

        order.adress_id = adress_id ?? order.adress_id;
        order.payment_id = payment_id ?? order.payment_id;
        order.value = value ?? order.value;
        order.status = status ?? order.satatus;

        await knex("orders").where({id}).update({
            adress_id: order.adress_id,
            payment_id: order.payment_id,
            value: order.value,
            status: order.status
        })


        return response.json()
    }

    async index(request, response){
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("É necessário estar autenticado para pedidos", 401)
        }

        const orderList = await knex("orders")
        .where({user_id})
        .select("id", "status", "updated_at", "value")

        let mealsList = [];

        for(let order = 0; order < orderList.length; order++){
            mealsList[order] = await knex("orderMeal")
                .join("orders", "orders.id", "orderMeal.order_id")
                .join("meals", "meals.id", "orderMeal.meal_id")
                .select("meals.title", "orderMeal.quantity")
                .where("orders.id", orderList[order].id)
        }

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

        return response.json(orders)
}

    async show(request, response){
        const { id } = request.params;    
        
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("É necessário estar autenticado para pedidos", 401)
        }

        const orderSearch = await knex("orders")
        .where({id})
        .first()
        .select("id", "status", "updated_at", "value")

        let meals = await knex("orderMeal")
            .join("orders", "orders.id", "orderMeal.order_id")
            .join("meals", "meals.id", "orderMeal.meal_id")
            .select("meals.title", "meals.price", "orderMeal.quantity")
            .where("orders.id", id)

        const myOrder = {
                ...orderSearch,
                meals
            }

        return response.json(myOrder)
    }

    async delete(request, response){
        const { id } = request.params;    
        
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("É necessário estar autenticado para pedidos", 401)
        }

        await knex("orders").where({id}).delete();

        return response.json()
    }
}

module.exports = OrdersController;