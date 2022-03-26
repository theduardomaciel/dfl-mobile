import { Request, Response } from "express";
import { CreateCommentInReportService } from "../services/CreateCommentInReportService"

class CreateCommentInReportController {
    async handle(request: Request, response: Response) {
        const {
            profile_id,
            profile_username,
            report_id,
            content
        } = request.body;
        console.log(request.body)

        const service = new CreateCommentInReportService();
        const result = await service.execute(
            profile_id,
            profile_username,
            report_id,
            content
        )

        return response.json(result)
    }
}

export { CreateCommentInReportController }