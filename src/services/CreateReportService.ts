import prismaClient from "../prisma"

class CreateReportService {
    async execute(user_id: number, address: string, coordinates: number[], image_url: string, tags: string, suggestion: string, hasTrashBins: boolean) {
        console.log(address, image_url, suggestion)
        try {
            const report = await prismaClient.report.create({
                data: {
                    user: {
                        connect: { id: user_id },
                    },
                    address: address,
                    coordinates: coordinates,
                    image_url: image_url,
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