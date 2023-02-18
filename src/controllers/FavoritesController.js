const AppError = require("../utils/AppError");

const FavoritesRepository = require("../repositories/FavoritesRepository");

const FavoritesCreateService = require("../services/Favorites/FavoritesCreateService");
const FavoritesDeleteService = require("../services/Favorites/FavoritesDeleteService");

class FavoritesController {
    async create(request, response){
        const { meal_id } = request.params;
        
        const user_id = request.user.id;

        const favoritesRepository = new FavoritesRepository();
        const favoritesCreateService = new FavoritesCreateService(favoritesRepository);

        try {
            await favoritesCreateService.execute({user_id, meal_id})
        } catch (e) {
            throw new AppError(e, 401)
        }
        
        return response.json()
    }

    async delete(request, response){
        const { meal_id } = request.params;
        
        const user_id = request.user.id;

        const favoritesRepository = new FavoritesRepository();
        const favoritesDeleteService = new FavoritesDeleteService(favoritesRepository);

        try {
            await favoritesDeleteService.execute({user_id, meal_id})
        } catch (e) {
            throw new AppError(e, 401)
        }

        return response.json()
    }
}

module.exports = FavoritesController;