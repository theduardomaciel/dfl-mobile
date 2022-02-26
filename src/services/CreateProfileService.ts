import prismaClient from "../prisma"

class CreateProfileService {
    async execute(user_id: number, username: string, defaultCity: string) {
        try {
            const response = await prismaClient.profile.create({
                data: {
                    user: {
                        connect: { id: user_id },
                    },
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

export { CreateProfileService }