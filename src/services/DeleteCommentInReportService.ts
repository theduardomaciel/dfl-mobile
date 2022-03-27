import prismaClient from "../prisma"

class DeleteCommentInReportService {
    async execute(
        comment_id
    ) {
        try {
            await prismaClient.comment.delete({
                where: {
                    id: comment_id
                }
            });
            console.log(`💭 Comentário de ID: ${comment_id} foi apagado com sucesso.`)
        } catch (error) {
            console.log(error)
        }
    }
}

export { DeleteCommentInReportService }