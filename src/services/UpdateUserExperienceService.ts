import prismaClient from "../prisma"
import { LEVELS_DATA } from "../utils/levels";

type Profile = {
    defaultCity: string;
    username: string;
    level: number;
    experience: number;
}

type User = {
    id: number;
    google_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
    profile: Profile | null;
    reports: Array<[]> | null;
    createdAt: Date;
}

class UpdateUserExperienceService {
    async execute(user: User) {
        try {
            const userProfile = user.profile

            let gainedExperience = 0
            if (userProfile.level < 3) {
                gainedExperience += 100
            } else if (userProfile.level >= 5 && userProfile.level <= 7) {
                gainedExperience += 150
            } else {
                gainedExperience += 175
            }

            let newLevel = userProfile.level;
            for (let index = 0; index < LEVELS_DATA.length; index++) {
                const level_data = LEVELS_DATA[index];
                if (userProfile.experience + gainedExperience > level_data.exp) {
                    newLevel = level_data.id
                }
            }

            await prismaClient.profile.update({
                where: {
                    id: user.id,
                },
                data: {
                    level: newLevel,
                    experience: userProfile.experience + gainedExperience
                }
            })
            return newLevel
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateUserExperienceService }