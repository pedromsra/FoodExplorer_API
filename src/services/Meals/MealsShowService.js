class MealsShowService {
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async execute({meal_id}){
        const meal = await this.mealsRepository.findMealById({meal_id})

        const ingredients = await this.mealsRepository.findIngredientsByMealId({meal_id});

        const mealWithIngredients = {...meal, ingredients};

        return mealWithIngredients;
    }
}

module.exports = MealsShowService;