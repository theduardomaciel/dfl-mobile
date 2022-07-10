import { Profile } from "../../../@types/application";
import { api } from "../../../utils/api";

type ReportResponse = {
    profile: Profile,
    experienceGained: number,
}

export default async function SubmitReport(data, profile) {
    console.log("Iniciando processo de upload do relatório.")
    try {
        const submitResponse = await api.post("/report", {
            profile_id: profile.id,
            coordinates: data.coordinates,
            address: data.address,
            imagesBase64: data.images_base64,
            tags: data.tags,
            suggestion: data.suggestion,
            hasTrashBins: data.hasTrashBins
        }, { timeout: 10000 })
        const response = submitResponse.data as ReportResponse
        if (parseInt(response.profile.level.toString()) !== profile.level) {
            console.log("O usuário subiu de nível.")
            // Caso o usuário tenha subido de nível, indicamos que ele não ganhou nenhuma experiência, e realizamos a tratativa no modal
            return {
                profile: response.profile,
                newLevel: true,
            }
        } else {
            console.log("O usuário não subiu de nível.")
            // Caso não, somente mostramos o quanto o usuário ganhou de exp
            return {
                profile: response.profile,
                newLevel: false,
                experienceGained: response.experienceGained,
            }
        }
    } catch (error) {
        console.log("Erro: ", error.response, error)
        return "error"
    }
}
