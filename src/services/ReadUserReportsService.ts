import prismaClient from "../prisma";

require('dotenv').config()

class ReadUserReportsService {
    async execute(user_id) {
        try {
            const reports = await prismaClient.report.findMany({
                where: {
                    id: user_id,
                },
            })
            return reports;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadUserReportsService }