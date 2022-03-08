import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
import { Report } from "../@types/application";

/* 
    - Recuperar informações do usuário na Google
    - Verificamos se o usuário existe no banco de dados
    - Se SIM = enviamos os dados da conta do usuário
    - Se NÃO = criamos o usuário com os dados da Google e enviamos os dados da conta recém-criada
*/

require('dotenv').config()

async function GetAdditionalInfo(access_token: string) {
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
                    "Authorization": `Bearer ${access_token}`,
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

class AuthenticateUserService {
    async execute(userInfo, access_token: string) {
        const { email, id, familyName, givenName, photo } = userInfo.user;
        //const [gender, birthday] = await GetAdditionalInfo(access_token)

        let user;
        user = await prismaClient.user.findUnique({
            where: {
                email: email
            },
            include: {
                profile: {
                    include: {
                        reports: true
                    }
                },
            }
        })

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    google_id: id,
                    first_name: givenName,
                    last_name: familyName,
                    email: email,
                    profile: {
                        create: {
                            image_url: photo,
                            reports: {
                                create: []
                            }
                        }
                    }
                },
                include: {
                    profile: true
                }
            })
        }
        const token = sign({
            user: {
                first_name: user.first_name,
                image_url: user.image_url,
                id: user.id,
            },
        }, process.env.JWT_SECRET, { subject: user.google_id, expiresIn: "1d", audience: "mobile-app" });

        console.log(user, "🙋 Usuário logado ou criado com sucesso!")
        return { token, user };
    }
}

export { AuthenticateUserService }