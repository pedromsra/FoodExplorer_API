class FavoritesCreateService{
    constructor(favoritesRepository){
        this.favoritesRepository = favoritesRepository;
    }

    async execute({user_id, meal_id}){
        if (!user_id) {
            throw "Faça login para favoritar um prato";
        }
        
        const checkFavorite = await this.favoritesRepository.findById({user_id, meal_id})
        
        if(checkFavorite){
            return checkFavorite.id
        }

        const favoriteCreated = await this.favoritesRepository.create({user_id, meal_id})

        return favoriteCreated
    }
}

module.exports = FavoritesCreateService