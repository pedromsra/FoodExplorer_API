const knex = require("../database/knex");

class MealsRepository{
    async findUserById({user_id}){
        const userId = await knex("users").where({id: user_id}).first();
        return userId;
    }

    async findMealByTitle({title}){
        const mealTitle = await knex("meals").where({title}).first();
        return mealTitle;
    }

    async findMealById({meal_id}){
        const meal = await knex("meals").where({id: meal_id}).first();
        return meal;
    }

    async findIngredientByName({name}){
        const ingredient = await knex("ingredients").whereLike("name", name).first();
        return ingredient
    }

    async createIngredient({name}){
        const ingredientId = await knex("ingredients").insert({
            name
        })

        return ingredientId
    }

    async createMeal({title, type, description, price}){
        const mealId = await knex("meals").insert({
            title,
            type,
            description,
            price
        })

        return mealId[0]
    }

    async createIngredientMeal({meal_id, ingredients}){
        const ingredientMealInsert = ingredients.map(ing => {
            return {
                meal_id,
                ingredient_id: ing.id
            }
        })

        const ingredientMealId = await knex("ingredientsMeal").insert(ingredientMealInsert);

        return ingredientMealId
    }

    async deleteIngredientMeal({meal_id}){
        await knex("ingredientsMeal").where({meal_id}).delete();
        return
    }

    async updateMeal({meal_id, title, type, description, price}){
        const mealUpdated = await knex("meals").where({ id: meal_id }).update({
            title,
            type,
            description,
            price,
            updated_at: knex.fn.now()
        })

        return mealUpdated;
    }

    async updateMealTotal({meal_id, meal}){
        const mealUpdated = await knex("meals").where({id: meal_id}).update(meal);
        
        return mealUpdated;
    }

    async findMealsByIngredientsAndTitle({title, ingredient}){
        const meals = await knex("ingredientsMeal")
            .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
            .join("meals", "meals.id", "ingredientsMeal.meal_id")
            .select("meals.id", "meals.title", "meals.description", "meals.image", "meals.price", "meals.type", "ingredients.id as ingId", "ingredients.name")
            .whereLike("meals.title", `%${title}%`)
            .whereLike("ingredients.name", ingredient)
            .orderBy("meals.title")

        return meals
    }

    async findMealsByTitle({title}){
        const meals = await knex("meals")
            .whereLike("title", `%${title}%`)
            .orderBy("title")

        return meals;
    }

    async findIngredients(){
        const ingredients = await knex("ingredientsMeal")
        .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
        .join("meals", "meals.id", "ingredientsMeal.meal_id")
        .select("meals.id", "ingredients.id as ingId", "ingredients.name")
        .orderBy("ingredients.name")

        return ingredients;
    }

    async findIngredientsByMealId({meal_id}){   
        const ingredients = await knex("ingredientsMeal")
            .where({meal_id})
            .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
            .select("ingredients.id", "ingredients.name")

        return ingredients;
    }
}

module.exports = MealsRepository;