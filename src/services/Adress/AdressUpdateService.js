const AdressCheckService = require("./AdressCheckService");

class AdressUpdateService {
    constructor(adressRepository){
        this.adressRepository = adressRepository;
    }

    async execute({user_id, adress_id, nickname, cep, number, streetName, city}){
        const adressCheckService = new AdressCheckService(this.adressRepository);

        await adressCheckService.check({user_id, adress_id, cep, number, streetName, city});

        const adress = await this.adressRepository.findByAdressId({adress_id});

        adress.nickname = nickname ?? adress.nickname;
        adress.cep = cep ?? adress.cep;
        adress.number = number ?? adress.number;
        adress.city = city ?? adress.city;

        
        const adressUpdated = await this.adressRepository.update({adress_id, nickname, cep, number, streetName, city});
        
        return adressUpdated
    }

}

module.exports = AdressUpdateService;