import prismaClient from "../prisma"

type User = {
    id: string;
    google_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
    profile: Array<[]>;
    reports: Array<[]>;
    createdAt: Date;
}

class CreateProfileService {
    async execute(user: User, username: string, defaultCity: string) {
        const profile = await prismaClient.profile.create({
            data: {
                user: {
                    connect: { email: user.email },
                },
                username,
                defaultCity,
            },
        });
        return profile;
    }
}

export { CreateProfileService }