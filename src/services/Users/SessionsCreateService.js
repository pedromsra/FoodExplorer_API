const { sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");
const authConfig = require("../../configs/auth");

class SessionsCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({email, password}){
        const user = await this.userRepository.findByEmail(email);

        if(!user){
            throw "Email e/ou senha incorreta.";
        }

        const passwordCheck = await compare(password, user.password);

        if(!passwordCheck) {
            throw "Email e/ou senha incorreta.";
        }
        
        const {secret, expiresIn} = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return {user, token}
    }
}

module.exports = SessionsCreateService;