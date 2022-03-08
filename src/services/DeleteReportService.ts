import prismaClient from "../prisma"
import { DeleteImageService } from "./api_calls/ImageService";

class DeleteReportService {
    async execute(
        report_id: number,
        image_deleteHash: string,
    ) {
        try {
            const result = await prismaClient.report.delete({
                where: {
                    id: report_id
                },
                include: {
                    profile: true
                }
            })
            console.log("Relatório removido do banco de dados com sucesso!")
            const service = new DeleteImageService();
            try {
                await service.execute(image_deleteHash)
                console.log("Imagem do relatório removida do imgur com sucesso!")
            } catch (error) {
                console.log(error)
            }
            return result;
        } catch (error) {
            console.log(error)
            return "error"
        }
    }
}

export { DeleteReportService }