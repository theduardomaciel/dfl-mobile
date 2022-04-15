import { Request, Response } from "express";
import { ReadProfilesWithFilterService } from "../services/ReadProfilesWithFilterService"

class ReadProfilesWithFilterController {
    async handle(request: Request, response: Response) {
        const { location, username, exclusionsId, searchCount } = request.body;

        const service = new ReadProfilesWithFilterService();
        try {
            const result = await service.execute(location, username, exclusionsId, searchCount)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadProfilesWithFilterController }