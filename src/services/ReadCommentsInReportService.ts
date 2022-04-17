import prismaClient from "../prisma";

class ReadCommentsInReportService {
    async execute(report_id) {
        try {
            const comments = await prismaClient.comment.findMany({
                where: {
                    reportId: report_id
                },
                include: {
                    profile: true
                }
            })
            return comments;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadCommentsInReportService }