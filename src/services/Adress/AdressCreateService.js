const AdressCheckService = require("./AdressCheckService");

class AdressCreateService {
    constructor(adressRepository){
        this.adressRepository = adressRepository;
    }

    async execute({user_id, nickname, cep, number, streetName, city}) {

        const adressCheckService = new AdressCheckService(this.adressRepository);

        await adressCheckService.check({user_id, cep, number, streetName, city});

        const adressCreated = await this.adressRepository.create({user_id, nickname, cep, number, streetName, city});

        return adressCreated;
    }
}

module.exports = AdressCreateService;