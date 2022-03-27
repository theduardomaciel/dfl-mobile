import { Request, Response } from "express";
import { DeleteCommentInReportService } from "../services/DeleteCommentInReportService"

class DeleteCommentInReportController {
    async handle(request: Request, response: Response) {
        const {
            comment_id
        } = request.body;
        console.log(request.body)

        const service = new DeleteCommentInReportService();
        const result = await service.execute(
            comment_id
        )

        return response.json(result)
    }
}

export { DeleteCommentInReportController }