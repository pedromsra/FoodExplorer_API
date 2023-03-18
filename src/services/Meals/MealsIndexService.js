class MealsIndexService {
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async execute({title, ingredient}){
        let meals;

        if(ingredient) {
            meals = await this.mealsRepository.findMealsByIngredientsAndTitle({title, ingredient})

            if(meals.length === 0){
                throw "Refeição não encontrada, por favor verifique sua busca"
            }
            
        } else {
            meals = await this.mealsRepository.findMealsByTitle({title})
        }
        
        const mealsIndex = meals.map(meal => {
            return {
                id: meal.id,
                title: meal.title,
                description: meal.description,
                price: meal.price,
                type: meal.type,
                image: meal.image
            }
        } )

        const ingredients = await await this.mealsRepository.findIngredients()
        
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