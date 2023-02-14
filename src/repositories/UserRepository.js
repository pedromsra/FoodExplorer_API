const knex = require("../database/knex");

class UserRepository {

    async findByEmail(email) {
        const user = await knex("users").where({email}).first();
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
}

module.exports = UserRepository;