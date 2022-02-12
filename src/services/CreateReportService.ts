import prismaClient from "../prisma"

class CreateReportService {
    async execute(user_id: number, address: string, coordinates: number[], image_url: string, tags: boolean[], suggestion: string, hasTrashBins: boolean) {
        const report = await prismaClient.report.create({
            data: {
                user_id,
                address,
                coordinates,
                image_url,
                tags,
                suggestion,
                hasTrashBins,
            },
            include: {
                user: true
            },
        });
        return report;
    }
}

export { CreateReportService }