const AppError = require("../utils/AppError");

const SessionsCreateService = require("../services/Users/SessionsCreateService");

const UserRepository = require("../repositories/UserRepository");

class SessionsController {
    async create(request, response){
        const {email, password} = request.body;

        const userRepository = new UserRepository();
        const sessionsCreateService = new SessionsCreateService(userRepository);

        try {
            const token = await sessionsCreateService.execute({email, password})
            return response.json(token)
        } catch (e) {
            throw new AppError(e, 401);
        }

    }
}

module.exports = SessionsController;