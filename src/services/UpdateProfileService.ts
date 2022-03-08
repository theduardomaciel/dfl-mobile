import prismaClient from "../prisma"

class UpdateProfileService {
    async execute(profile_id: number, username: string, defaultCity: string) {
        try {
            const response = await prismaClient.profile.update({
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
            if (response) {
                console.log(`🙋 Perfil do usuário atualizado com sucesso!`);
                return response;
            } else {
                console.log("❌ Ocorreu um erro ao tentar ao atualizar o perfil.")
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateProfileService }