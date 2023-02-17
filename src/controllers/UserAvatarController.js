const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const UserAvatarService = require("../services/Users/UsersAvatarService");

const UserRepository = require("../repositories/UserRepository");

class UserAvatarController {
    async update(request, response) {
        const diskStorage = new DiskStorage();

        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const userRepository = new UserRepository();
        const userAvatarService = new UserAvatarService(userRepository, diskStorage);

        try {
            await userAvatarService.execute({user_id, avatarFilename})
        } catch (e) {
            throw new AppError(e, 401);
        }

        return response.json();
    }
}

module.exports = UserAvatarController;