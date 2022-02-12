import { Request, Response } from "express";
import { CreateReportService } from "../services/CreateReportService"

class CreateReportController {
    async handle(request: Request, response: Response) {
        // user_id: string, address: string, coordinates: number[], image_url: string, tags: boolean[], suggestion: string, hasTrashBins: boolean
        const { user_id, address, cooordinates, image_url, tags, suggestion, hasTrashBins } = request.body;
        //const { user_id } = request;

        const service = new CreateReportService();
        const result = await service.execute(user_id, address, cooordinates, image_url, tags, suggestion, hasTrashBins)

        return response.json(result)
    }
}

export { CreateReportController }