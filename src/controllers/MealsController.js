const AppError = require("../utils/AppError");

const MealsRepository = require("../repositories/MealsRepository");

const MealsCreateService = require("../services/Meals/MealsCreateService");
const MealsUpdateService = require("../services/Meals/MealsUpdateService");
const MealsIndexService = require("../services/Meals/MealsIndexService");
const MealsShowService = require("../services/Meals/MealsShowService");

class MealsController {
    async create(request, response){
        const { title, type, description, price, ingredients } = request.body;

        const user_id = request.user.id;

        const mealsRepository = new MealsRepository();

        const mealsCreateService = new MealsCreateService(mealsRepository);
        
        try {
            await mealsCreateService.execute({user_id, title, type, description, price, ingredients })
        } catch (e) {
            throw new AppError(e, 401)
        }

        return response.json();
    }

    async update(request, response){
        const { id } = request.params;
        
        const { title, type, description, price, ingredients } = request.body;

        const user_id = request.user.id;

        const mealsRepository = new MealsRepository();

        const mealsUpdateService = new MealsUpdateService(mealsRepository);

        try {
            await mealsUpdateService.execute({user_id, meal_id: id, title, type, description, price, ingredients })
        } catch (e) {
            throw new AppError(e, 401)
        }

        return response.json();
    }

    async index(request, response){
        const { title, ingredient } = request.query;

        const mealsRepository = new MealsRepository();

        const mealsIndexService = new MealsIndexService(mealsRepository);

        try {
            const mealsWithIngredients = await mealsIndexService.execute({title, ingredient})
            return response.json(mealsWithIngredients);
        } catch (e) {
            throw new AppError(e, 401)
        }

    }

    async show(request, response){
        const { id } = request.params;

        const mealsRepository = new MealsRepository();

        const mealsShowService = new MealsShowService(mealsRepository);

        try {
            const mealWithIngredients = await mealsShowService.execute({meal_id: id})
            return response.json(mealWithIngredients);
        } catch (e) {
            throw new AppError(e, 401)
        }

    }

    async delete(request, response){
        // const { id } = request.params;

        // const user_id = request.user.id;

        // const checkUserAdm = await knex("users").where({id: user_id}).first();
        
        // if (checkUserAdm.role === "default") {
        //     throw new AppError ("Você não tem acesso à remoção de refeições", 401);
        // }

        // await knex("meals").where({id}).delete()

        // return response.json()
    }
}

module.exports = MealsController;