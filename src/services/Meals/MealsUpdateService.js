const MealsCheckService = require("./MealsCheckService")

class MealsUpdateService{
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async execute({user_id, meal_id, title, type, description, price, ingredients}){
        
        const mealsCheckService = new MealsCheckService(this.mealsRepository);

        await mealsCheckService.check({user_id, meal_id, title, type, description, price, ingredients});

        const meal = await this.mealsRepository.findMealById({meal_id});

        meal.title = title ?? meal.title;
        meal.type = type ?? meal.type;
        meal.description = description ?? meal.description;
        meal.price = price ?? meal.price;
        
        await this.mealsRepository.deleteIngredientMeal({meal_id})

        let ingredientsList = [];

        for (let ing = 0; ing < ingredients.length; ing++) {
            let ingredient = await this.mealsRepository.findIngredientByName({name: ingredients[ing]});

            if (ingredient) {
                ingredientsList.push(ingredient);
            } else {
                let newIngredientId = await this.mealsRepository.createIngredient({name: ingredients[ing]})
                
                ingredientsList.push({id: newIngredientId, name: ingredients[ing]})
            }
        }

        const ingredientMealId = await this.mealsRepository.createIngredientMeal({meal_id, ingredients: ingredientsList});
        
        await this.mealsRepository.updateMeal({meal_id, title, type, description, price})
        console.log("oi")
        return ingredientMealId
    }
}

module.exports = MealsUpdateService