const knex = require("../database/knex");
const { sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");

const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

class SessionsController {
    async create(request, response){
        const {email, password} = request.body;

        const user = await knex("users").where({email}).first();

        if(!user){
            throw new AppError ("Email e/ou senha incorreta.", 401);
        }

        const passwordCheck = await compare(password, user.password);

        if(!passwordCheck) {
            throw new AppError("Email e/ou senha incorreta.", 401);
        }

        const {secret, expiresIn} = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({user, token})
    }
}

module.exports = SessionsController;