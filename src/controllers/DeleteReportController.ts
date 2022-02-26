import { Request, Response } from "express";
import { DeleteReportService } from "../services/DeleteReportService"

class DeleteReportController {
    async handle(request: Request, response: Response) {
        const {
            report_id,
            image_deleteHash
        } = request.body;

        const service = new DeleteReportService();
        const result = await service.execute(report_id, image_deleteHash,)

        return response.json(result)
    }
}

export { DeleteReportController }