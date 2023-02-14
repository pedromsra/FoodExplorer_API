const knex = require("../database/knex");
const mealsRoutes = require("../routes/meals.routes");
const AppError = require("../utils/AppError");

class MealsController {
    async create(request, response){
        const { title, type, description, price, ingredients } = request.body;

        const user_id = request.user.id;

        const checkUserAdm = await knex("users").where({id: user_id}).first();

        const checkTitle = await knex("meals").where({title}).first();

        if (checkUserAdm.role === "default") {
            throw new AppError ("Você não tem acesso à criação de refeições", 401);
        }

        if(checkTitle){
            throw new AppError("Essa refeição já exite / nome já está em uso", 401)
        }

        if (!title) {
            throw new AppError("É necessário informar o nome da refeição", 401);
        }

        if (!description) {
            throw new AppError("É necessário informar a descrição da refeição", 401);
        }
        
        if (!price) {
            throw new AppError("É necessário informar o preço da refeição", 401);
        }
        
        let ingredientsList = [];
        
        for (let ing = 0; ing < ingredients.length; ing++) {
            let ingredient = await knex("ingredients").whereLike("name", ingredients[ing]).first();

            if (ingredient) {
                ingredientsList.push(ingredient);
            } else {
                let newIngredientId = await knex("ingredients").insert({
                    name: ingredients[ing]
                })
                
                ingredientsList.push({id: newIngredientId[0], name: ingredients[ing]})
            }
        }
        
        const meal_id = await knex("meals").insert({
            title,
            type,
            description,
            price
        })

        const insertMeal = meal_id[0];
        
        const ingredientMealInsert = ingredientsList.map(ing => {
            return {
                meal_id: insertMeal,
                ingredient_id: ing.id
            }
        })
        
        await knex("ingredientsMeal").insert(ingredientMealInsert);

        return response.json();
    }

    async update(request, response){
        const { id } = request.params;
        
        const { title, type, description, price, ingredients } = request.body;

        const user_id = request.user.id;

        const checkUserAdm = await knex("users").where({id: user_id}).first();
        
        if (checkUserAdm.role === "default") {
            throw new AppError ("Você não tem acesso à criação de refeições", 401);
        }
        
        const meal = await knex("meals").where({id}).first();

        if(title) {
            const checkTitle = await knex("meals").where({title}).first();

            if(checkTitle && checkTitle.id !== Number(id)){
                throw new AppError("Essa refeição já exite / nome já está em uso", 401)
            }
        }

        meal.title = title ?? meal.title;
        meal.type = type ?? meal.type;
        meal.description = description ?? meal.description;
        meal.price = price ?? meal.price;

        if(ingredients) {
            await knex("ingredientsMeal").where({meal_id: id}).delete();

            let ingredientsList = [];

            for (let ing = 0; ing < ingredients.length; ing++) {
                let ingredient = await knex("ingredients").whereLike("name", ingredients[ing]).first();
                
                if (ingredient) {
                    ingredientsList.push(ingredient);
                } else {
                    let newIngredientId = await knex("ingredients").insert({
                        name: ingredients[ing]
                    })
                    
                    ingredientsList.push({id: newIngredientId[0], name: ingredients[ing]})
                }
            }

            const ingredientMealInsert = ingredientsList.map(ing => {
                return {
                    meal_id: id,
                    ingredient_id: ing.id
                }
            })
            
            await knex("ingredientsMeal").insert(ingredientMealInsert);

        } else {
            throw new AppError ("É necessário informar os ingredientes dessa refeição", 401);
        }
        
        await knex("meals").where({ id }).update({
            title: meal.title,
            type: meal.type,
            description: meal.description,
            price: meal.price,
            updated_at: knex.fn.now()
        })

        // Eu preciso acessar a ingredientsMeal, selecionar todas as linhas que tenham o meal_id = id e pegar os ingredientes presentes,
        //colocar numa array para fazer um filter (remover) ou adicionar, tipo:
        // await knex("ingredientsMeal").select("ingredient_id").where({meal_id})

        
        return response.json();
    }

    async index(request, response){
        const { title, ingredient } = request.query;

        let meals;

        if(ingredient) {
            meals = await knex("ingredientsMeal")
                .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
                .join("meals", "meals.id", "ingredientsMeal.meal_id")
                .select("meals.id", "meals.title", "meals.description", "meals.price", "meals.type", "ingredients.id as ingId", "ingredients.name")
                .whereLike("meals.title", `%${title}%`)
                .whereLike("ingredients.name", ingredient)
                .orderBy("meals.title")
        } else {
            meals = await knex("meals")
                .whereLike("title", `%${title}%`)
                .orderBy("title")
        }
        
        const mealsIndex = meals.map(meal => {
            return {
                id: meal.id,
                title: meal.title,
                description: meal.description,
                price: meal.price,
                type: meal.type
            }
        } )

        const ingredients = await knex("ingredientsMeal")
            .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
            .join("meals", "meals.id", "ingredientsMeal.meal_id")
            .select("meals.id", "ingredients.id as ingId", "ingredients.name")
            .orderBy("ingredients.name")

        const mealsWithIngredients = mealsIndex.map(meal => {
            const mealIngredients = ingredients.filter(ing => ing.id === meal.id)

            const mealIngredientsIndex = mealIngredients.map(meal => {
                return {
                    id: meal.ingId,
                    name: meal.name
                }
            })

            return {
                ...meal,
                ingredients: mealIngredientsIndex
            }
        })

        return response.json(mealsWithIngredients);

    }

    async show(request, response){
        const { id } = request.params;

        const meal = await knex("meals")
            .where({id})
            .first()

        const ingredients = await knex("ingredientsMeal")
            .where({meal_id: id})
            .join("ingredients", "ingredients.id", "ingredientsMeal.ingredient_id")
            .select("ingredients.id", "ingredients.name")

        console.log(ingredients)
        const mealWithIngredients = {...meal, ingredients}

        return response.json(mealWithIngredients)
    }

    async delete(request, response){
        const { id } = request.params;

        const user_id = request.user.id;

        const checkUserAdm = await knex("users").where({id: user_id}).first();
        
        if (checkUserAdm.role === "default") {
            throw new AppError ("Você não tem acesso à remoção de refeições", 401);
        }

        await knex("meals").where({id}).delete()

        return response.json()
    }
}

module.exports = MealsController;