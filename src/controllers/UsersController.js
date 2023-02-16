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
        const user_id = request.user.id;

        const {name, email, passwordOld, passwordNew} = request.body;

        if(!user_id){
            throw new AppError("Você deve estar logado para alterar as informações de usuário", 401);
        }

        const user = await knex("users").where({id: user_id}).first();
        
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        
        if (passwordNew) {
            if(!passwordOld){
                throw new AppError("Você deve informar a sua senha antiga", 401);
            }
            
            
            const passwordCheck = await compare(passwordOld, user.password);
            
            if (!passwordCheck) {
                throw new AppError("Senha antiga não confere", 401);
            }
            
            if(passwordNew.length < 6) {
                throw new AppError("Sua nova senha deve conter no mínimo 6 caracteres", 401)
            }
            
            user.password = await hash(passwordNew, 8);
        }


        await knex("users").where({id:user_id}).update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now()
        })

        return response.json()

    }

    async delete (request, response) {
        const user_id = request.user.id;

        await knex("users").where({id: user_id}).delete();

        return response.json();
    }
}

module.exports = UsersController;