import { Request, Response } from "express";
import { CreateReportService } from "../services/CreateReportService"

class CreateReportController {
    async handle(request: Request, response: Response) {
        const {
            user_id,
            address,
            coordinates,
            image_url,
            image_deleteHash,
            tags,
            suggestion,
            hasTrashBins
        } = request.body;
        console.log(request.body)

        const service = new CreateReportService();
        const result = await service.execute(
            user_id,
            address,
            coordinates,
            image_url,
            image_deleteHash,
            tags,
            suggestion,
            hasTrashBins
        )

        return response.json(result)
    }
}

export { CreateReportController }