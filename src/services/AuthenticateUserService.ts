import axios from "axios";

/* 
    - Primeiro precisamos gerar um "authCode". Para gerar esse código utilizamos 
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
        console.log(code)
        try {
            const response = await axios.get(
                `https://people.googleapis.com/v1/people/*?personFields=genders%2Cbirthdays&key=${process.env.GOOGLE_WEB_CLIENT_ID}`,
                {
                    headers: {
                        "Authorization": `Bearer ${code}`,
                        "Accept": 'application/json'
                    },
                })
            console.log("Deu certo.")
            return response.data;
        } catch (error) {
            console.log(error)
        }

    }
}

export { AuthenticateUserService }