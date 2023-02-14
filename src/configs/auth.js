module.exports = {
    jwt: {
        secret: process.env.TOKEN || "default",
        expiresIn: "1d"
    }
}