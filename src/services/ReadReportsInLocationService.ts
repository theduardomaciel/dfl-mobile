import prismaClient from "../prisma";

class ReadReportsInLocationService {
    async execute(location) {
        try {
            const reports = await prismaClient.report.findMany({
                where: {
                    address: {
                        contains: location
                    }
                },
                take: 10,
                include: {
                    comments: {
                        include: {
                            profile: true
                        }
                    },
                    profile: true
                }
            })
            console.log(reports)
            console.log("Obtemos relatórios na localização fornecida.")
            return reports;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadReportsInLocationService }