import axios from "axios";

/* 
    - Recuperar informações do usuário na Google
    - Verificamos se o usuário existe no banco de dados
    - Se SIM = enviamos os dados da conta do usuário
    - Se NÃO = criamos o usuário com os dados da Google e enviamos os dados da conta recém-criada
*/

require('dotenv').config()

class AuthenticateUserService {
    async execute(code: string) {

        /* const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${code}`,
                "Accept": "application/json",
            }
        };
 */
        // Pra funcionar, precisa colocar o cartão de crédito na Google
        console.log(code)
        try {
            const response = await axios.get(
                `https://people.googleapis.com/v1/people/*?personFields=genders&key=AIzaSyCKZMrAWYeOHOoIHLnCDKoGxyi4VMlaa9A`,
                {
                    headers: {
                        "Authorization": `Bearer ${code}`,
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
}

export { AuthenticateUserService }