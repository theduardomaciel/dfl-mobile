import { Request, Response } from "express";
import { UpdateReportService } from "../services/UpdateReportService"

class UpdateReportController {
    async handle(request: Request, response: Response) {
        const { report_id, decrement, rating, profile_id, profileRating, tags } = request.body;

        const service = new UpdateReportService();
        const result = await service.execute(report_id, decrement, rating, profile_id, profileRating, tags)

        return response.json(result)
    }
}

export { UpdateReportController }