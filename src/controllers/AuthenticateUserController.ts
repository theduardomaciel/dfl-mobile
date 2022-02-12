import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService"

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { acess_token, user_info } = request.body;

        const service = new AuthenticateUserService();
        try {
            const result = await service.execute(user_info, acess_token)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { AuthenticateUserController }