const MealsCheckService = require("./MealsCheckService")

class MealsCreateService {
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async execute({user_id, title, type, description, price, ingredients}){
        
        const mealsCheckService = new MealsCheckService(this.mealsRepository);

        await mealsCheckService.check({user_id, title, type, description, price, ingredients});
        
        const meal_id = await this.mealsRepository.createMeal({title, type, description, price})

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

        return ingredientMealId
    }
}

module.exports = MealsCreateService;