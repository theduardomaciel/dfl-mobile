import { Request, Response } from "express";
import { UpdateProfileService } from "../services/UpdateProfileService"

class UpdateProfileController {
    async handle(request: Request, response: Response) {
        const { user_id, username, defaultCity } = request.body;

        const service = new UpdateProfileService();
        const result = await service.execute(user_id, username, defaultCity)

        return response.json(result)
    }
}

export { UpdateProfileController }