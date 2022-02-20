import { ImgurClient } from 'imgur';

require('dotenv').config()
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

// hash da primeira imagem de teste para deletar: 7r5TlGBX1FQZXx1

class UploadImageService {
    async execute(image_base64: string, user_id: number) {
        const date = new Date();
        try {
            const response = await client.upload({
                image: image_base64,
                title: `report_${date.getDay()}-${date.getMonth()}_${user_id}`,
                type: "base64",
            });
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
}

class DeleteImageService {
    async execute(image_deleteHash: string) {
        try {
            const response = await client.deleteImage(image_deleteHash)
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
}

export { DeleteImageService, UploadImageService }