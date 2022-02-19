import { Request, Response } from "express";
import { ReadUserReportsService } from "../services/ReadUserReportsService"

class ReadUserReportsController {
    async handle(request: Request, response: Response) {
        const { user_id } = request.body;

        const service = new ReadUserReportsService();
        try {
            const result = await service.execute(user_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadUserReportsController }