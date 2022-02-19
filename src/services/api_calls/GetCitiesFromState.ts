import axios from "axios";

require('dotenv').config()

async function GetAdditionalInfo(acess_token: string) {
    const ciso = ""
    const siso = ""
    try {
        const response = await axios.get(
            `https://api.countrystatecity.in/v1/countries/[ciso]/states/[siso]/cities`,
            {
                headers: {
                    "Authorization": `Bearer ${acess_token}`,
                    "Accept": 'application/json'
                },
            })
        console.log("Deu certo.")
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(error)
            console.log("Erro de resposta")
        } else if (error.request) {
            console.log(error)
            console.log("Erro de pedido")
        } else if (error.message) {
            console.log(error)
            console.log("Erro de mensagem")
        }
    }
}

class GetCitiesFromStateService {
    async execute(userState: string) {

    }
}

export { GetCitiesFromStateService }