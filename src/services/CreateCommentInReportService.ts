import prismaClient from "../prisma"

class CreateCommentInReportService {
    async execute(
        profile_id,
        profile_username,
        report_id,
        content
    ) {
        try {
            const comment = await prismaClient.comment.create({
                data: {
                    Report: {
                        connect: { id: report_id },
                    },
                    profile: {
                        connect: { username: profile_username }
                    },
                    content: content,
                },
                include: {
                    profile: true
                }
            });
            console.log(comment, `💭 Comentário criado pelo perfil ${profile_username} com sucesso no relatório de ID: ${report_id}.`)
            return comment;
        } catch (error) {
            console.log(error)
        }
    }
}

export { CreateCommentInReportService }