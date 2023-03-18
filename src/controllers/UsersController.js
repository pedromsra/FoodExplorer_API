const AppError = require("../utils/AppError");

const UserCreateService = require("../services/Users/UserCreateService");
const UserUpdateService = require("../services/Users/UserUpdateService");

const UserRepository = require("../repositories/UserRepository");

class UsersController {
    async create (request, response) {
        const {name, email, password, role_password} = request.body

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        if (role_password) {
            try {
                await userCreateService.execute({name, email, password, console_password})
            } catch (e) {
                throw new AppError(e, 401);
            }

            return response.status(201).json({name, email, password}, "admin");
        }

        try {
            await userCreateService.execute({name, email, password})
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.status(201).json({name, email, password});
    }

    async update  (request, response) {
        const user_id = request.user.id;

        const {name, email, passwordOld, passwordNew} = request.body;

        const userRepository = new UserRepository();
        const userUpdateService = new UserUpdateService(userRepository);

        try {
            await userUpdateService.execute({user_id, name, email, passwordOld, passwordNew});
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.json()

    }

    async delete (request, response) {
        // const user_id = request.user.id;

        // if(!user_id) {
        //     throw new AppError("É necessário estar autenticado para excluir sua conta", 401)
        // }

        // const userRepository = new UserRepository();

        // await userRepository.delete({user_id});

        // return response.json();
    }
}

module.exports = UsersController;