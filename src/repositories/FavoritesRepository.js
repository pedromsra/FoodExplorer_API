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
}

module.exports = FavoritesRepository;