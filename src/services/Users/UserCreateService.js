const {hash} = require("bcryptjs");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({name, email, password, role, role_password}){

        const checkEmail = await this.userRepository.findByEmail(email);

        if(checkEmail) {
            throw "Email já cadastrado";
        }


        if(password.length < 6) {
            throw "A sua senha deve conter no mínimo 6 caracteres";
        }

        const hashedPassword = await hash(password, 8);

        const adm_password = process.env.ADM_ROLE_PASSWORD || "123456";

        if(role) {
            if(role_password !== adm_password) {
                throw "Acesso negado, procure a admnistração"
            }

            const userCreated = this.userRepository.create({name, email, password: hashedPassword, role, role_password});

            return userCreated;
        }

        const userCreated = this.userRepository.create({name, email, password: hashedPassword});

        return userCreated;
    }
}

module.exports = UserCreateService;