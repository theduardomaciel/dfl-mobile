import prismaClient from "../prisma";

class ReadCommentsInReportService {
    async execute(report_id) {
        try {
            const comments = await prismaClient.comment.findMany({
                where: {
                    report_id: report_id
                },
                include: {
                    profile: true,
                }
            })
            console.log(`Comentários do relatório de ID: ${report_id} foram encontrados! (${comments.length})`)
            return comments;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadCommentsInReportService }