import prismaClient from "../prisma";

class ReadProfileService {
    async execute(profile_id) {
        try {
            const profile = await prismaClient.profile.findUnique({
                where: {
                    id: profile_id,
                },
                include: {
                    reports: true
                }
            })
            return profile;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadProfileService }