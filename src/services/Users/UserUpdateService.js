const {hash, compare} = require("bcryptjs");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({user_id, name, email, passwordOld, passwordNew}){

        const user = await this.userRepository.findById(user_id);

        if(!user) {
            throw "É necessário estar autenticado para realizar atualizações em seu perfil"
        }

        if(email){
            const checkEmail = await this.userRepository.findByEmail(email);
            if(checkEmail && checkEmail.id !== user_id){
                throw "Email já cadastrado"
            }
        }
        
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        
        if (passwordNew) {
            if(!passwordOld){
                throw "Você deve informar a sua senha antiga";
            }

            const passwordCheck = await compare(passwordOld, user.password);
            
            if (!passwordCheck) {
                throw "Senha antiga não confere";
            }
            
            if(passwordNew.length < 6) {
                throw "Sua nova senha deve conter no mínimo 6 caracteres";
            }
            
            user.password = await hash(passwordNew, 8);
        }


        const userUpdated = await this.userRepository.update({user_id, name: user.name, email:user.email, password: user.password})

        return userUpdated
    }
}

module.exports = UserCreateService;