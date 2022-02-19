import prismaClient from "../prisma"

type User = {
    id: number;
    google_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
    profile: Array<[]> | null;
    reports: Array<[]> | null;
    createdAt: Date;
}

class CreateProfileService {
    async execute(user: User, username: string, defaultCity: string) {
        try {
            const profile = await prismaClient.profile.create({
                data: {
                    user: {
                        connect: { id: user.id },
                    },
                    username,
                    defaultCity,
                },
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