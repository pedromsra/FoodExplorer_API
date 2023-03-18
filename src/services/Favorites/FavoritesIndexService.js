class FavoritesIndexService{
    constructor(favoritesRepository){
        this.favoritesRepository = favoritesRepository;
    }

    async execute({user_id}){
        if (!user_id) {
            throw "Faça login para exibir seus favoritos";
        }

        const favoritesList = await this.favoritesRepository.favoritesIndex({user_id})
        const mealsList = await this.favoritesRepository.mealsByFavorites({favorites: favoritesList})

        return mealsList
    }
}

module.exports = FavoritesIndexService