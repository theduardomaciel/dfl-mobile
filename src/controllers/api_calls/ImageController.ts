import { Request, Response } from "express";

import { UploadImageService, DeleteImageService } from "../../services/api_calls/ImageService"

class UploadImageController {
    async handle(request: Request, response: Response) {
        const { image_base64, user_id } = request.body;

        const service = new UploadImageService();
        try {
            const result = await service.execute(image_base64, user_id)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

class DeleteImageController {
    async handle(request: Request, response: Response) {
        const { image_deleteHash } = request.body;

        const service = new DeleteImageService();
        try {
            const result = await service.execute(image_deleteHash)
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message });
        }
    }
}

export { UploadImageController, DeleteImageController }