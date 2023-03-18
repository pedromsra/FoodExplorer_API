class FavoritesShowService{
    constructor(favoritesRepository){
        this.favoritesRepository = favoritesRepository;
    }

    async execute({user_id, meal_id}){
        if (!user_id) {
            throw "Faça login para exibir seus favoritos";
        }

        const favorite = await this.favoritesRepository.checkFavorite({user_id, meal_id})

        if(favorite) {
            return true
        } else {
            return false
        }
    }
}

module.exports = FavoritesShowService