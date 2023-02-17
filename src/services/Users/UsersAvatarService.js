class UserAvatarService {
    constructor(userRepository, diskStorage) {
        this.userRepository = userRepository;
        this.diskStorage = diskStorage
    }
    
    async execute({user_id, avatarFilename}){

        const user = await this.userRepository.findById(user_id);

        
        if(!user){
            throw "Somente usuários logados podem alterar seu avatar.";
        }
        
        if(user.avatar){
            await this.diskStorage.deleteFile(user.avatar);
        }
        
        const filename = await this.diskStorage.saveFile(avatarFilename);
        
        user.avatar = filename;
        
        const avatarUpdated = await this.userRepository.updateAvatar({user_id, user});
        
        return avatarUpdated
    }
}

module.exports = UserAvatarService;
