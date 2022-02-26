import prismaClient from "../prisma"
import { DeleteImageService } from "./api_calls/ImageService";

class DeleteReportService {
    async execute(
        report_id: number,
        image_deleteHash: string,
    ) {
        try {
            await prismaClient.report.delete({
                where: {
                    id: report_id
                },
                include: {
                    user: {
                        include: {
                            reports: true,
                            profile: true
                        }
                    }
                }
            })
            const service = new DeleteImageService();
            console.log("Relatório removido do banco de dados com sucesso!")
            try {
                const result = await service.execute(image_deleteHash)
                console.log("Imagem do relatório removida do Imgur com sucesso!")
                return "success"
            } catch (error) {
                console.log(error)
                return "error"
            }
        } catch (error) {
            console.log(error)
            return "error"
        }
    }
}

export { DeleteReportService }