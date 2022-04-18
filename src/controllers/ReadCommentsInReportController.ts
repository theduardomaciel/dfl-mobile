import { Request, Response } from "express";
import { ReadCommentsInReportService } from "../services/ReadCommentsInReportService"

class ReadCommentsInReportController {
    async handle(request: Request, response: Response) {
        const { report_id } = request.body;

        const service = new ReadCommentsInReportService();
        try {
            const result = await service.execute(report_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadCommentsInReportController }