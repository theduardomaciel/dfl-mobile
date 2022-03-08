import { Request, Response } from "express";
import { ReadProfileService } from "../services/ReadProfileService"

class ReadProfileController {
    async handle(request: Request, response: Response) {
        const { user_id } = request.body;

        const service = new ReadProfileService();
        try {
            const result = await service.execute(user_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { ReadProfileController }