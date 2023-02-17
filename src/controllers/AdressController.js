const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const AdressRepository = require("../repositories/AdressRepository");

const AdressCreateService = require("../services/Adress/AdressCreateService");
const AdressUpdateService = require("../services/Adress/AdressUpdateService");
const AdressShowService = require("../services/Adress/AdressShowService");
// const AdressDeleteService = require("../services/Adress/AdressDeleteService");

class AdressController {
    async create(request, response){
        const user_id = request.user.id;

        const { nickname, cep, number, streetName, city } = request.body;

        const adressRepository = new AdressRepository();

        const adressCreateService = new AdressCreateService(adressRepository);
        
        try {
            await adressCreateService.execute({user_id, nickname, cep, number, streetName, city});
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.json()

    }

    async update(request, response){
        const { id } = request.params;

        const {nickname, cep, number, streetName, city } = request.body;

        const user_id = request.user.id;

        const adressRepository = new AdressRepository();

        const adressUpdateService = new AdressUpdateService(adressRepository);

        try {
            await adressUpdateService.execute({user_id, adress_id: id, nickname, cep, number, streetName, city})
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.json();
    }

    async index(request, response){
        const user_id = request.user.id;

        const adressRepository = new AdressRepository();

        if(!user_id){
            throw new AppError("É necessários estar autenticado para visualizar seus endereços", 401)
        }

        const myAdresses = await adressRepository.index({user_id});

        return response.json(myAdresses);
    }

    async show(request, response){
        const { id } = request.params;

        const user_id = request.user.id;

        const adressRepository = new AdressRepository();

        const adressShowService = new AdressShowService(adressRepository);

        try {
            const myAdress = await adressShowService.execute({user_id, adress_id: id});
            return response.json(myAdress);
        } catch(e) {
            throw new AppError(e,401)
        }
        
    }

    async delete(request, response){
        // const { id } = request.params;

        // const user_id = request.user.id;

        // const adressRepository = new AdressRepository();

        // const adressDeleteService = new AdressDeleteService(adressRepository);

        // try {
        //     await adressDeleteService.execute({user_id, adress_id: id})
        // } catch(e) {
        //     throw new AppError(e, 401)
        // }

        // return response.json();
    }
}

module.exports = AdressController;