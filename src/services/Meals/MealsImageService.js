class MealsImageService{
    constructor(mealsRepository, diskStorage) {
        this.mealsRepository = mealsRepository;
        this.diskStorage = diskStorage
    }

    async execute({user_id, meal_id, imageFilename}){
        
        const checkUserAdm = await this.mealsRepository.findUserById({user_id});
        
        if (checkUserAdm.role === "default") {
            throw "Você não tem acesso à alteração de imagem de um prato";
        }


        const meal = await this.mealsRepository.findMealById({meal_id});

        
        if(meal.image){
            await this.diskStorage.deleteFile(meal.image);
        }
        
        const filename = await this.diskStorage.saveFile(imageFilename);
        
        meal.image = filename;
        
        await this.mealsRepository.updateMealTotal({meal_id, meal});

        return meal
    }
}

module.exports = MealsImageService