import prismaClient from "../prisma"

class UpdateReportService {
    async execute(report_id: number, rating: JSON, tags: JSON) {
        try {
            const report = await prismaClient.report.update({
                where: {
                    id: report_id
                },
                data: {
                    ratings: rating && JSON.stringify(rating),
                    tags: tags && JSON.stringify(tags)
                },
                include: {
                    comments: true,
                    profile: true
                }
            });
            if (report) {
                console.log(`✅ Relatório atualizado com sucesso!`, report);
                return report;
            } else {
                console.log("❌ Ocorreu um erro ao tentar atualizar o relatório.")
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateReportService }