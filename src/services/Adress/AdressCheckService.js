class AdressCheckService {
    constructor(adressRepository){
        this.adressRepository = adressRepository;
    }

    async check({user_id, order, adress_id, cep, number, streetName, city}){
        
        if(!user_id) {
            throw "É necessário estar logado para salvar um endereço"
        }

        
        if(!cep){
            throw "O campo CEP é obrigatório";
        } else {
            const checkCep = cep.split("-");
            if(checkCep.length !== 2 || checkCep[0].length !== 5 || checkCep[1].length !== 3){
                throw "O CEP deve conter 5 dígitos e 3 dígitos, separado por hífen, no formato: 12345-123";
            }
        }
        
        if(!number){
            throw "O campo número é obrigatório";
        }
        
        if(!streetName){
            throw "O campo rua é obrigatório";
        }
        
        if(!city){
            throw "O campo cidade é obrigatório";
        }

        if(adress_id){
            
            const adress = await this.adressRepository.findByAdressId({adress_id});
            
            if(adress.user_id !== user_id){
                throw "Acesso negado"
            }
            
            if(adress && adress.id !== adress_id && !order) {
                throw "Endereço já cadastrado";
            }

            return adress
        } else {

            const checkAdress = await this.adressRepository.findByCepAndNumber({user_id, cep, number});
    
            if(checkAdress && !order) {
                throw "Endereço já cadastrado";
            }

            return checkAdress
        }
    }
}

module.exports = AdressCheckService;