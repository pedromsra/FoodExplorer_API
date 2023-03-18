const AppError = require("../utils/AppError");

const SessionsCreateService = require("../services/Users/SessionsCreateService");

const UserRepository = require("../repositories/UserRepository");

class SessionsController {
    async create(request, response){
        const {email, password} = request.body;

        const userRepository = new UserRepository();
        const sessionsCreateService = new SessionsCreateService(userRepository);
        
        try {
            const sessionResponse = await sessionsCreateService.execute({email, password})
            const {user, token} = sessionResponse
            return response.json({user, token})
        } catch (e) {
            throw new AppError(e, 401);
        }

    }
}

module.exports = SessionsController;