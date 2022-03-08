import { Request, Response } from "express";
import { UpdateProfileService } from "../services/UpdateProfileService"

class UpdateProfileController {
    async handle(request: Request, response: Response) {
        const { profile_id, username, defaultCity } = request.body;

        console.log("Iniciando atualização do perfil do usuário...");

        const service = new UpdateProfileService();
        const result = await service.execute(profile_id, username, defaultCity)

        return response.json(result)
    }
}

export { UpdateProfileController }