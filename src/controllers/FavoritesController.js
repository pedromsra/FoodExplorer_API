const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesController {
    async create(request, response){
        const { meal_id } = request.params;
        
        const user_id = request.user.id;

        const mealId = Number(meal_id)
                
        const checkUser = await knex("users").where({id: user_id}).first();
        
        if (!checkUser) {
            throw new AppError ("Faça login para favoritar um prato", 401);
        }
        
        const checkFavorite = await knex("favorites").where({user_id}).where({meal_id}).first();

        if(checkFavorite){
            return response.json()
        }

        await knex("favorites").insert({
            meal_id,
            user_id
        })

        return response.json()
    }

    async delete(request, response){
        const { meal_id } = request.params;
        
        const user_id = request.user.id;
                
        const checkUser = await knex("users").where({id: user_id}).first();
        
        if (!checkUser) {
            throw new AppError ("Faça login para desfavoritar um prato", 401);
        }
        
        const checkFavorite = await knex("favorites").where({user_id}).where({meal_id}).first();

        if(!checkFavorite){
            return response.json()
        }

        await knex("favorites").where({user_id}).where({meal_id}).delete()

        return response.json()
    }
}

module.exports = FavoritesController;