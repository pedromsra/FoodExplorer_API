const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const { hash, compare } = require("bcryptjs");

const UserCreateService = require("../services/Users/UserCreateService");

const UserRepository = require("../repositories/UserRepository");

class UsersController {
    async create (request, response) {
        const {name, email, password, role, role_password} = request.body

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        if (role) {
            try {
                await userCreateService.execute({name, email, password, role, role_password})
            } catch (e) {
                throw new AppError(e, 401);
            }

            return response.status(201).json({name, email, password, role});
        }

        try {
            await userCreateService.execute({name, email, password})
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.status(201).json({name, email, password});
    }

    async update  (request, response) {
        // Para usar o id do usuário no controller usar: user_id = request.user.id
    }

    async index (request, response) {
        // Para usar o id do usuário no controller usar: user_id = request.user.id
    }

    async show (request, response) {
        // Para usar o id do usuário no controller usar: user_id = request.user.id
    }

    async delete (request, response) {
        const user_id = request.user.id;

        await knex("users").where({id: user_id}).delete();

        return response.json();
    }
}

module.exports = UsersController;