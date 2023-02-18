class MealsCheckService{
    constructor(mealsRepository){
        this.mealsRepository = mealsRepository;
    }

    async check({user_id, meal_id, title, type, description, price, ingredients }){
        const checkUserAdm = await this.mealsRepository.findUserById({user_id})
        
        if(!title) {
            throw "É necessário informar o nome da refeição";
        } else {
            const checkTitle = await this.mealsRepository.findMealByTitle({title})

            if(meal_id){
                if(checkTitle && checkTitle.id !== Number(meal_id)){
                    throw "Essa refeição já exite / nome já está em uso";
                }
            } else {
                if(checkTitle){
                    throw "Essa refeição já exite / nome já está em uso";
                }
            }
        }

        if (checkUserAdm.role === "default") {
            if(meal_id){
                throw "Você não tem acesso à edição de refeições";
            }
            throw "Você não tem acesso à criação de refeições";
        }

        if(!type) {
            throw "É necessário informar o tipo da refeição"
        }

        if (!description) {
            throw "É necessário informar a descrição da refeição";
        }
        
        if (!price) {
            throw "É necessário informar o preço da refeição";
        }

        if(!ingredients || ingredients.length === 0) {
            throw "É necessário informar os ingredientes dessa refeição";
        }

        return
    }
}

module.exports = MealsCheckService;