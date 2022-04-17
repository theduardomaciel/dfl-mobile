import { Request, Response } from "express";
import { ReadReportsWithFilterService } from "../services/ReadReportsWithFilterService"

class ReadReportsWithFilterController {
    async handle(request: Request, response: Response) {
        const { location, username, exclusionsId, profileToExcludeId, searchCount, includeInfo } = request.body;

        const service = new ReadReportsWithFilterService();
        try {
            const result = await service.execute(location, username, exclusionsId, profileToExcludeId, searchCount, includeInfo)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadReportsWithFilterController }