import { Request, Response } from "express";
import { CreateProfileService } from "../services/CreateProfileService"

class CreateProfileController {
    async handle(request: Request, response: Response) {
        const { user, username, defaultCity } = request.body;

        const service = new CreateProfileService();
        const result = await service.execute(user, username, defaultCity)

        return response.json(result)
    }
}

export { CreateProfileController }