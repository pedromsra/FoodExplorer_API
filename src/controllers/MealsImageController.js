const AppError = require("../utils/AppError");

const DiskStorage = require("../providers/DiskStorage");

const MealsRepository = require("../repositories/MealsRepository");

const MealsImageService = require("../services/Meals/MealsImageService");

class MealsImageController {
    async update(request, response) {
        const user_id = request.user.id;
        const { id } = request.params;
        const imageFilename = request.file.filename;
        
        const diskStorage = new DiskStorage();
        const mealsRepository = new MealsRepository();
        const mealsImageService = new MealsImageService(mealsRepository, diskStorage);

        try {
            const mealImageUpdated = await mealsImageService.execute({user_id, meal_id: id, imageFilename})
            
            return response.json({mealImageUpdated})
        } catch(e) {
            throw new AppError(e, 401);
        }
        


        // const checkUserAdm = await knex("users").where({id: user_id}).first();
        
        // if (checkUserAdm.role === "default") {
        //     throw new AppError ("Você não tem acesso à alteração de imagem de um prato", 401);
        // }

        // const meal = await knex("meals").where({id}).first();

        // if(meal.image){
        //     await diskStorage.deleteFile(meal.image);
        // }

        // const filename = await diskStorage.saveFile(imageFilename);
        
        // meal.image = filename;

        // await knex("meals").update(meal).where({id});

        // return response.json(meal);
    }
}

module.exports = MealsImageController;