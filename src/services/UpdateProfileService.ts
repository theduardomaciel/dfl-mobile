import prismaClient from "../prisma"

class UpdateProfileService {
    async execute(user_id: number, username: string, defaultCity: string) {
        try {
            const response = await prismaClient.profile.update({
                where: {
                    user_id: user_id
                },
                data: {

                    username: username,
                    defaultCity: defaultCity,
                },
                include: {
                    user: {
                        include: {
                            reports: true,
                            profile: true
                        }
                    }
                }
            });
            if (response) {
                console.log(`Perfil do usuário ${response.user.first_name} de id: ${response.user.id} foi criado!`);
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateProfileService }