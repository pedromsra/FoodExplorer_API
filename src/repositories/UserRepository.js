const knex = require("../database/knex");

class UserRepository {

    async findByEmail(email) {
        const user = await knex("users").where({email}).first();
        return user;
    }

    async findById(user_id){
        const user = await knex("users").where({id: user_id}).first();
        return user;
    }

    async create({name, email, password, role}) {
        
        if(role) {
            const userId = await knex("users").insert({
                name,
                email,
                password,
                role: "admin"
            })

            return {id: userId}
        }

        const userId = await knex("users").insert({
            name,
            email,
            password
        })

        return {id: userId}
    }

    async update({user_id, name, email, password}){
        const userId = await knex("users").where({id: user_id}).update({
            name,
            email,
            password,
            updated_at: knex.fn.now()
        })

        return {id: userId}
    }

    async updateAvatar({user_id, user}){
        const userId = await knex("users").where({id: user_id}).update(user)

        return {id: userId}
    }

    async delete({user_id}){
        await knex("users").where({id: user_id}).delete()
        return
    }
}

module.exports = UserRepository;