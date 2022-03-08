import { Request, Response } from "express";
import { ReadReportsInLocationService } from "../services/ReadReportsInLocationService"

class ReadReportsInLocationController {
    async handle(request: Request, response: Response) {
        const { location } = request.body;

        const service = new ReadReportsInLocationService();
        try {
            const result = await service.execute(location)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadReportsInLocationController }