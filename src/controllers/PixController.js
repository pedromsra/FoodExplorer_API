const AppError = require("../utils/AppError");

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https")

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

class PixController {
    async generateCob(request, response) {

        const {pixValue, pixKey, pixMessage} = request.body
        
        const cert = fs.readFileSync(
        path.resolve(__dirname, `../../certs/${process.env.GN_H_CERT}`)
        )
        
        const agent = new https.Agent({
            pfx: cert,
            passphrase: ''
        });
        
        const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString("base64")
        
        const authResponse = await axios({
            method: "POST",
            url: `${process.env.GN_ENDPOINT}/oauth/token`,
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
            },
            httpsAgent: agent,
            data: {
                grant_type: "client_credentials"
            }
        })
            
            const accessToken = authResponse.data?.access_token;
        
            const reqGN = axios.create({
                baseURL: process.env.GN_ENDPOINT,
                httpsAgent: agent,
                headers : {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
        
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

        const {loc_id} = request.body

        const cert = fs.readFileSync(
            path.resolve(__dirname, `../../certs/${process.env.GN_H_CERT}`)
            )
            
            const agent = new https.Agent({
                pfx: cert,
                passphrase: ''
            });
            
            const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString("base64")
            
            const authResponse = await axios({
                method: "POST",
                url: `${process.env.GN_ENDPOINT}/oauth/token`,
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: agent,
                data: {
                    grant_type: "client_credentials"
                }
            })
                
                const accessToken = authResponse.data?.access_token;
            
                const reqGN = axios.create({
                    baseURL: process.env.GN_ENDPOINT,
                    httpsAgent: agent,
                    headers : {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
        
        const qrcodeResponse = await reqGN.get(`/v2/loc/${loc_id}/qrcode`)

        return response.json(qrcodeResponse.data);

    }
}

module.exports = PixController



