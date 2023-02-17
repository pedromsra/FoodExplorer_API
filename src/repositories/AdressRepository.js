const knex = require("../database/knex");

class AdressRepository {
    async findByCepAndNumber({user_id, cep, number}){
        const checkAdress = await knex("adress").where({user_id}).where({cep}).where({number}).first()
        return checkAdress;
    }

    async findByAdressId({adress_id}){
        const adress = await knex("adress").where({id: adress_id}).first();
        if(!adress) {
            throw "endereço inexistente"
        }
        return adress
    }

    async create({user_id, nickname, cep, number, streetName, city}) {
        const adressId = await knex("adress").insert({
            user_id,
            nickname,
            cep,
            number,
            streetName,
            city
        })

        return {id: adressId}
    }

    async update({adress_id, nickname, cep, number, streetName, city}) {
        const adressId = await knex("adress").where({id: adress_id}).update({
            nickname,
            cep,
            number,
            streetName,
            city
        })

        return adressId
    }

    async index({user_id}) {
        const myAdresses = await knex("adress").where({user_id});
        return myAdresses
    }

    async show({adress_id}) {
        const myAdress = await knex("adress").where({id: adress_id}).first();
        return myAdress
    }

    async delete({adress_id}) {
        const adress = await knex("adress").where({id: adress_id}).delete();
        return adress
    }


}

module.exports = AdressRepository;