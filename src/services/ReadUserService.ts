import prismaClient from "../prisma";

require('dotenv').config()

class ReadUserService {
    async execute(user_id) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    profile: true,
                }
            })
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadUserService }