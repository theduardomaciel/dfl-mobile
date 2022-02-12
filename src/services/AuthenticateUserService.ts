import axios from "axios";
import prismaClient from "../prisma";

/* 
    - Recuperar informações do usuário na Google
    - Verificamos se o usuário existe no banco de dados
    - Se SIM = enviamos os dados da conta do usuário
    - Se NÃO = criamos o usuário com os dados da Google e enviamos os dados da conta recém-criada
*/

require('dotenv').config()

async function GetAdditionalInfo(acess_token: string) {
    /* const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${code}`,
                "Accept": "application/json",
            }
        };
        */
    // Pra funcionar, precisa colocar o cartão de crédito na Google
    try {
        const response = await axios.get(
            `https://people.googleapis.com/v1/people/*?personFields=genders&key=AIzaSyCKZMrAWYeOHOoIHLnCDKoGxyi4VMlaa9A`,
            {
                headers: {
                    "Authorization": `Bearer ${acess_token}`,
                    "Accept": 'application/json'
                },
            })
        console.log("Deu certo.")
        //return response.data;
        const gender = "null";
        const birthday = "null";
        return [gender, birthday]
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

/* interface IUserResponse {
    email: string,
    id: string,
    name: string,
    first_name: string,
    last_name: string,
    image_url: string,
} */

class AuthenticateUserService {
    async execute(userInfo, acess_token: string) {
        const { email, id, familyName, givenName, photo } = userInfo.user;
        //const [gender, birthday] = await GetAdditionalInfo(acess_token)

        let user = await prismaClient.user.findFirst({
            where: {
                google_id: id
            }
        })

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    google_id: id,
                    first_name: givenName,
                    last_name: familyName,
                    email: email,
                    image_url: photo,
                }
            })
        }

        /* const token = sign(
            {
                user: {
                name: user.name,
                avatar_ur: user.avatar_url,
                id: user.id,
                },
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d",
            }
        ); */
        const token = ""

        return { token, user };
    }
}

export { AuthenticateUserService }