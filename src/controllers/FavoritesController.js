const AppError = require("../utils/AppError");

const FavoritesRepository = require("../repositories/FavoritesRepository");

const FavoritesCreateService = require("../services/Favorites/FavoritesCreateService");
const FavoritesIndexService = require("../services/Favorites/FavoritesIndexService");
const FavoritesShowService = require("../services/Favorites/FavoritesShowService");
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

    async index(request, response){
        const user_id = request.user.id;
        
        const favoritesRepository = new FavoritesRepository();
        const favoritesIndexService = new FavoritesIndexService(favoritesRepository);
        
        try {
            const favoritesList = await favoritesIndexService.execute({user_id})
            return response.json(favoritesList)
        } catch {
            throw new AppError(e, 401)
        }
    }

    async show(request, response){
        const user_id = request.user.id;
        const { meal_id } = request.params;
        
        const favoritesRepository = new FavoritesRepository();
        const favoritesShowService = new FavoritesShowService(favoritesRepository);
        
        try {
            const favorite = await favoritesShowService.execute({user_id, meal_id})
            return response.json(favorite)
        } catch {
            throw new AppError(e, 401)
        }
    }
}

module.exports = FavoritesController;