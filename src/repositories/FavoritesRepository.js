const knex = require("../database/knex");

class FavoritesRepository{
    async findById({user_id, meal_id}){
        const favoriteId = await knex("favorites").where({user_id}).where({meal_id}).first();
        return favoriteId
    }

    async create({user_id, meal_id}){
        const favoriteCreated = await knex("favorites").insert({
            meal_id,
            user_id
        })
        return favoriteCreated
    }

    async delete({user_id, meal_id}){
        await knex("favorites").where({user_id}).where({meal_id}).delete()
        return
    }

    async favoritesIndex({user_id}){
        const index = await knex("favorites").where({user_id})
        return(index)
    }

    async checkFavorite({user_id, meal_id}){
        const index = await knex("favorites").where({user_id}).where({meal_id}).first()
        return(index)
    }

    async mealsByFavorites({favorites}){
        let mealsList = [];
        for (let favorite=0; favorite < favorites.length; favorite++){
            mealsList[favorite] = await knex("meals").where({id: favorites[favorite].meal_id}).first()
        }
        
        return mealsList
    }
}

module.exports = FavoritesRepository;