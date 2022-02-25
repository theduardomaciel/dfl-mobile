import { User } from "../@types/application";
import prismaClient from "../prisma"


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
        console.log(coordinates)
        try {
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
            });
            return report;
        } catch (error) {
            console.log(error)
        }
    }
}

export { CreateReportService }