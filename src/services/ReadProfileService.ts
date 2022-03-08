import prismaClient from "../prisma";

class ReadProfileService {
    async execute(user_id) {
        console.log(user_id)
        try {
            const user = await prismaClient.profile.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    reports: true
                }
            })
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadProfileService }