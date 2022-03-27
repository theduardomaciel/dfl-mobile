import { Request, Response } from "express";
import { UpdateReportService } from "../services/UpdateReportService"

class UpdateReportController {
    async handle(request: Request, response: Response) {
        const { report_id, rating, tags } = request.body;

        console.log("Iniciando atualização do perfil do usuário...");

        const service = new UpdateReportService();
        const result = await service.execute(report_id, rating, tags)

        return response.json(result)
    }
}

export { UpdateReportController }