import { Profile, User } from "../@types/application";
import prismaClient from "../prisma"
import { NODE_LEVELS_DATA } from "../utils/friendlyForNodeLevels";

function CheckUserLevelAndExperience(userProfile: Profile) {
    let newExperience = userProfile.experience
    if (userProfile.level < 3) {
        newExperience += 100
    } else if (userProfile.level >= 5 && userProfile.level <= 7) {
        newExperience += 150
    } else {
        newExperience += 175
    }

    let newLevel = userProfile.level;
    for (let index = 0; index < NODE_LEVELS_DATA.length; index++) {
        const level_data = NODE_LEVELS_DATA[index];
        if (newExperience >= level_data.exp) {
            newLevel = level_data.id
            newExperience = 0
        }
    }
    return { newLevel, newExperience }
}

class UpdateUserExperienceService {
    async execute(user: User) {
        try {
            const { newLevel, newExperience } = CheckUserLevelAndExperience(user.profile);
            await prismaClient.profile.update({
                where: {
                    id: user.id,
                },
                data: {
                    level: newLevel,
                    experience: user.profile.experience + newExperience
                }
            })
            return newLevel
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateUserExperienceService, CheckUserLevelAndExperience }