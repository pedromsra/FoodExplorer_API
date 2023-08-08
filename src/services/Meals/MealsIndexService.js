class MealsIndexService {
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async execute({title, ingredient}){

        const ingredientMeals = await this.mealsRepository.findMealsByIngredientsAndTitle({ingredient})
        
        const titleMeals = await this.mealsRepository.findMealsByTitle({title})

        if(titleMeals.length === 0 && ingredientMeals.length === 0){
            throw "Refeição não encontrada, por favor verifique sua busca"
        }

        const meals = [...ingredientMeals, ...titleMeals]

        const meals_ids = meals.map(meal => meal.id)
        let filterRepetitions = [...new Set(meals_ids)];
        const uniqueMeals = filterRepetitions.map(id => meals.find(meal => meal.id === id))

        const mealsIndex = uniqueMeals.map(meal => {
            return {
                id: meal.id,
                title: meal.title,
                description: meal.description,
                price: meal.price,
                type: meal.type,
                image: meal.image
            }
        } )

        const ingredients = await this.mealsRepository.findIngredients()

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

        return mealsWithIngredients
    }
}

module.exports = MealsIndexService