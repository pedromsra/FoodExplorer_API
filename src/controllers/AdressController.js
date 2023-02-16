const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class AdressController {
    async create(request, response){
        const user_id = request.user.id;

        const { nickname, cep, number, streetName, city } = request.body;

        if(!user_id) {
            throw new AppError("É necessário estar logado para salvar um endereço", 401)
        }

        if(!cep){
            throw new AppError("O campo CEP é obrigatório", 401);
        } else {
            const checkCep = cep.split("-");
            if(checkCep.length !== 2 || checkCep[0].length !== 5 || checkCep[1].length !== 3){
                throw new AppError("O CEP deve conter 5 dígitos e 3 dígitos, separado por hífen, no formato: 12345-123")
            }
        }
        
        if(!number){
            throw new AppError("O campo número é obrigatório", 401);
        }

        if(!streetName){
            throw new AppError("O campo rua é obrigatório", 401)
        }

        if(!city){
            throw new AppError("O campo cidade é obrigatório", 401)
        }

        const checkAdress = await knex("adress").where({user_id}).where({cep}).where({number})

        if(checkAdress) {
            throw new AppError("Endereço já cadastrado", 401)
        }

        const adress = await knex("adress").insert({
            user_id,
            nickname,
            cep,
            number,
            streetName,
            city
        })

        return response.json()

    }

    async update(request, response){
        const { id } = request.params;

        const {nickname, cep, number, streetName, city } = request.body;

        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("Somente usuários autenticados podem alterar enderços", 401);
        }

        const adress = await knex("adress").where({id}).where({user_id}).first();

        if(!cep){
            throw new AppError("O campo CEP é obrigatório", 401);
        } else {
            const checkCep = cep.split("-");
            if(checkCep.length !== 2 || checkCep[0].length !== 5 || checkCep[1].length !== 3){
                throw new AppError("O CEP deve conter 5 dígitos e 3 dígitos, separado por hífen, no formato: 12345-123")
            }
            adress.cep = cep ?? adress.cep;
        }
        
        if(!number){
            throw new AppError("O campo número é obrigatório", 401);
        }

        if(!streetName){
            throw new AppError("O campo rua é obrigatório", 401)
        }

        if(!city){
            throw new AppError("O campo cidade é obrigatório", 401)
        }
        
        adress.nickname = nickname ?? adress.nickname;
        adress.number = number ?? adress.number;
        adress.city = city ?? adress.city;

        await knex("adress").where({id}).where({user_id}).update({
            nickname: adress.nickname,
            cep: adress.cep,
            number: adress.number,
            streetName: adress.streetName,
            city: adress.city,
            updated_at: knex.fn.now()
        })

        return response.json();
    }

    async index(request, response){
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("É necessários estar autenticado para visualizar seus endereços", 401)
        }

        const myAdresses = await knex("adress").where({user_id});

        return response.json(myAdresses);
    }

    async show(request, response){
        const { id } = request.params;

        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("É necessários estar autenticado para visualizar seus endereços", 401)
        }

        const myAdress = await knex("adress").where({id}).where({user_id}).first();

        return response.json(myAdress);
    }

    async delete(request, response){
        const { id } = request.params;

        const user_id = request.user.id;

        if(!user_id) {
            throw new AppError("É necessário está autenticado para remover um endereço", 401)
        }

        await knex("adress").where({id}).delete();

        return response.json();
    }
}

module.exports = AdressController;