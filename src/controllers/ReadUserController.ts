import { Request, Response } from "express";
import { ReadUserService } from "../services/ReadUserService"

class ReadUserController {
    async handle(request: Request, response: Response) {
        const { user_id } = request.body;

        const service = new ReadUserService();
        try {
            const result = await service.execute(user_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadUserController }