class AdressDeleteService {
    constructor(adressRepository){
        this.adressRepository = adressRepository;
    }

    async execute({user_id, adress_id}){
        if(!user_id) {
            throw new AppError("É necessário está autenticado para remover um endereço", 401)
        }

        const adress = await this.adressRepository.findByAdressId({adress_id});
        
        if(adress.user_id !== user_id){
            throw "Acesso negado";
        }

        await this.adressRepository.delete({adress_id});

        return;
    }
}

module.exports = AdressDeleteService;