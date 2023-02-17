class AdressShowService{
    constructor(adressRepository){
        this.adressRepository = adressRepository;
    }
    async execute({user_id, adress_id}){

        if(!user_id){
            throw "É necessários estar autenticado para visualizar seus endereços";
        }
        
        const adress = await this.adressRepository.findByAdressId({adress_id});
        
        if(adress.user_id !== user_id){
            throw "Acesso negado";
        }

        const myAdress = await this.adressRepository.show({adress_id});

        return myAdress;
    }
}

module.exports = AdressShowService;