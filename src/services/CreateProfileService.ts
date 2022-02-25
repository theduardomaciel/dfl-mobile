import { User } from "../@types/application";
import prismaClient from "../prisma"

class CreateProfileService {
    async execute(user: User, username: string, defaultCity: string) {
        try {
            const profile = await prismaClient.profile.create({
                data: {
                    user: {
                        connect: { id: user.id },
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
            if (profile) {
                console.log(`Perfil do usuário ${user.first_name} de id: ${user.id} foi criado!`, profile);
                return profile;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { CreateProfileService }