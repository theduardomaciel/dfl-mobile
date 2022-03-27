import prismaClient from "../prisma"

import { User, Profile } from "../@types/application";
import { CheckUserLevelAndExperience } from "./UpdateUserExperienceService";

class CreateReportService {
    async execute(
        profile_id: number,
        address: string,
        coordinates: Array<number>,
        image_url: string,
        image_deleteHash: string,
        tags: string,
        suggestion: string,
        hasTrashBins: boolean
    ) {
        try {
            const report = await prismaClient.report.create({
                data: {
                    profile: {
                        connect: { id: profile_id },
                    },
                    address: address,
                    coordinates: coordinates,
                    image_url: image_url,
                    image_deleteHash: image_deleteHash,
                    tags: JSON.stringify(tags),
                    ratings: JSON.stringify({
                        1: [],
                        2: [],
                        3: [],
                        4: [],
                        5: [],
                    }),
                    suggestion: suggestion,
                    hasTrashBins: hasTrashBins,
                },
            });
            const profile = await prismaClient.profile.findUnique({
                where: {
                    id: profile_id,
                },
            })
            // Adicionando XP ao perfil do usuário, e o subindo de nível caso haja experiência suficiente
            const { USER_LEVEL, USER_EXPERIENCE } = CheckUserLevelAndExperience(profile)
            console.log("NEW LEVEL:", USER_LEVEL, "NEW EXPERIENCE: ", USER_EXPERIENCE)
            const updatedProfile = await prismaClient.profile.update({
                where: {
                    id: profile_id
                },
                data: {
                    level: USER_LEVEL,
                    experience: USER_EXPERIENCE
                },
                include: {
                    reports: true
                }
            })
            console.log(updatedProfile)
            return updatedProfile;
        } catch (error) {
            console.log(error)
        }
    }
}

export { CreateReportService }