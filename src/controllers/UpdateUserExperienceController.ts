import { Request, Response } from "express";
import { UpdateUserExperienceService } from "../services/UpdateUserExperienceService"

class UpdateUserExperienceController {
    async handle(request: Request, response: Response) {
        const { user_id } = request.body;

        const service = new UpdateUserExperienceService();
        try {
            const result = await service.execute(user_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { UpdateUserExperienceController }