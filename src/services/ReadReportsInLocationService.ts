import prismaClient from "../prisma";

class ReadReportsInLocationService {
    async execute(location, exclusionsId, profileToExcludeId) {
        try {
            const reports = await prismaClient.report.findMany({
                where: {
                    address: {
                        contains: location
                    },
                    id: { notIn: exclusionsId },
                    profile_id: { not: profileToExcludeId }
                },
                take: 10,
                include: {
                    comments: {
                        include: {
                            subComments: true,
                            profile: true
                        }
                    },
                    profile: true
                }
            })
            console.log(reports, "🗺️ Obtivemos os 10 primeiros relatórios na localização fornecida com as exclusões determinadas.")
            return reports;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadReportsInLocationService }