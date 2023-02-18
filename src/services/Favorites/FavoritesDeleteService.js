class FavoritesDeleteService{
    constructor(favoritesRepository){
        this.favoritesRepository = favoritesRepository;
    }

    async execute({user_id, meal_id}){
        if (!user_id) {
            throw "Faça login para desfavoritar um prato";
        }
        
        const checkFavorite = await this.favoritesRepository.findById({user_id, meal_id});

        if(!checkFavorite){
            return
        }

        await this.favoritesRepository.delete({user_id, meal_id})

        return
    }

}

module.exports = FavoritesDeleteService