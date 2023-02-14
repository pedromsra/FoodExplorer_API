const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class MealsImageController {
    async update(request, response) {
        const diskStorage = new DiskStorage();
        const user_id = request.user.id;
        const { id } = request.params;
        const imageFilename = request.file.filename;
        
        const checkUserAdm = await knex("users").where({id: user_id}).first();
        
        if (checkUserAdm.role === "default") {
            throw new AppError ("Você não tem acesso à alteração de imagem de um prato", 401);
        }
        console.log(id)
        const meal = await knex("meals").where({id}).first();
        console.log(meal)
        if(meal.image){
            await diskStorage.deleteFile(meal.image);
        }

        const filename = await diskStorage.saveFile(imageFilename);
        
        meal.image = filename;

        await knex("meals").update(meal).where({id});

        return response.json(meal);
    }
}

module.exports = MealsImageController;