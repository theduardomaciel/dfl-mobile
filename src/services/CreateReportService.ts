import prismaClient from "../prisma"

import { User, Profile } from "../@types/application";
import { CheckUserLevelAndExperience } from "./UpdateUserExperienceService";

class CreateReportService {
    async execute(
        user: User,
        address: string,
        coordinates: Array<number>,
        image_url: string,
        image_deleteHash: string,
        tags: string,
        suggestion: string,
        hasTrashBins: boolean
    ) {
        const { newLevel, newExperience } = CheckUserLevelAndExperience(user.profile)
        try {
            // Adicionando XP ao perfil do usuário, e o subindo de nível caso haja experiência suficiente
            await prismaClient.profile.update({
                where: {
                    user_id: user.id
                },
                data: {
                    level: newLevel,
                    experience: newExperience
                }
            })
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
                            profile: true
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