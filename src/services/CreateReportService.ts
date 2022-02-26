import prismaClient from "../prisma"

import { User, Profile } from "../@types/application";
import { CheckUserLevelAndExperience } from "./UpdateUserExperienceService";

class CreateReportService {
    async execute(
        user_id: number,
        address: string,
        coordinates: Array<number>,
        image_url: string,
        image_deleteHash: string,
        tags: string,
        suggestion: string,
        hasTrashBins: boolean
    ) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    profile: true,
                }
            })
            // Adicionando XP ao perfil do usuário, e o subindo de nível caso haja experiência suficiente
            if (user.profile) {
                const { USER_LEVEL, USER_EXPERIENCE } = CheckUserLevelAndExperience(user.profile)
                console.log("USER LEVEL AND EXPERIENCE: ", USER_LEVEL, USER_EXPERIENCE)
                await prismaClient.profile.update({
                    where: {
                        user_id: user.id
                    },
                    data: {
                        level: USER_LEVEL,
                        experience: USER_EXPERIENCE
                    }
                })
            }
            const report = await prismaClient.report.create({
                data: {
                    user: {
                        connect: { id: user.id },
                    },
                    address: address,
                    coordinates: coordinates,
                    image_url: image_url,
                    image_deleteHash: image_deleteHash,
                    tags: JSON.stringify(tags),
                    suggestion: suggestion,
                    hasTrashBins: hasTrashBins,
                },
                include: {
                    user: {
                        include: {
                            reports: true,
                            profile: user.profile ? true : false
                        }
                    }
                }
            });
            return report;
        } catch (error) {
            console.log(error)
        }
    }
}

export { CreateReportService }