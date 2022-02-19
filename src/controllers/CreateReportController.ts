import { Request, Response } from "express";
import { CreateReportService } from "../services/CreateReportService"

class CreateReportController {
    async handle(request: Request, response: Response) {
        const { user_id, address, cooordinates, image_url, tags, suggestion, hasTrashBins } = request.body;

        const service = new CreateReportService();
        const result = await service.execute(user_id, address, cooordinates, image_url, tags, suggestion, hasTrashBins)

        return response.json(result)
    }
}

export { CreateReportController }