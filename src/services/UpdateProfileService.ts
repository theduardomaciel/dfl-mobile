import prismaClient from "../prisma"

class UpdateProfileService {
    async execute(profile_id: number, username: string, defaultCity: string) {
        try {
            const profile = await prismaClient.profile.update({
                where: {
                    id: profile_id
                },
                data: {
                    username: username,
                    defaultCity: defaultCity,
                },
                include: {
                    reports: true
                }
            });
            if (profile) {
                console.log(`🙋 Perfil do usuário atualizado com sucesso!`);
                return profile;
            } else {
                console.log("❌ Ocorreu um erro ao tentar atualizar o perfil do usuário.")
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateProfileService }