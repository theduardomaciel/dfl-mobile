import prismaClient from "../prisma";

class ReadUserService {
    async execute(user_id) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    profile: {
                        include: {
                            reports: true
                        }
                    }
                }
            })
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadUserService }