const AppError = require("../utils/AppError");

const GNRequest = require("../middleware/oAuthPixAuth")

const reqGNAlready = GNRequest({clientID: process.env.GN_CLIENT_ID, clientSecret: process.env.GN_CLIENT_SECRET})

class PixController {

    async generateCob(request, response) {

        const reqGN = await reqGNAlready
        const {pixValue, pixKey, pixMessage} = request.body

            const dataCob = {
                calendario: {
                    expiracao: 3600
                },
                valor: {
                    original: pixValue
                },
                chave: pixKey,
                solicitacaoPagador: pixMessage
            }
        
            const cobResponse = await reqGN.post("/v2/cob", dataCob);

            return response.json(cobResponse.data.loc.id);

    }

    async generateQrCode(request, response) {

        const reqGN = await reqGNAlready
        const {loc_id} = request.body

        const qrcodeResponse = await reqGN.get(`/v2/loc/${loc_id}/qrcode`)

        return response.json(qrcodeResponse.data);

    }

    async indexByDay (request, response) {

        const {date} = request.body

        const dateTreated = date.split("/")

        const year = dateTreated[2]
        const month = dateTreated[1]
        const day = dateTreated[0]

        const reqGN = await reqGNAlready;

        const cobResponse = await reqGN.get(`/v2/cob?inicio=${year}-${month}-${day}T00:00:00Z&fim=${year}-${month}-${day}T23:59:00Z`)

        return response.json(cobResponse.data)
    }
}

module.exports = PixController



