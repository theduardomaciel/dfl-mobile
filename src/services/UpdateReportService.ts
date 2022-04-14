import prismaClient from "../prisma"

class UpdateReportService {
    async execute(report_id: number, decrement: boolean, rating: any, profile_id: number, profileRating: {}, tags: JSON) {
        try {
            // Primeiramente removemos o voto anterior do usuário, caso exista
            if (decrement) {
                console.log("Removendo voto anterior do usuário.")
                await prismaClient.report.update({
                    where: {
                        id: report_id
                    },
                    data: {
                        note1: {
                            decrement: rating[1] ? rating[1][1] : 0,
                        },
                        note2: {
                            decrement: rating[2] ? rating[2][1] : 0,
                        },
                        note3: {
                            decrement: rating[3] ? rating[3][1] : 0,
                        },
                        note4: {
                            decrement: rating[4] ? rating[4][1] : 0,
                        },
                        note5: {
                            decrement: rating[5] ? rating[5][1] : 0,
                        },
                    },
                });
            }
            if (rating) {
                console.log("Adicionando novo voto do usuário.")
            }
            const report = await prismaClient.report.update({
                where: {
                    id: report_id
                },
                data: {
                    note1: {
                        increment: rating[1] ? rating[1][0] : 0,
                    },
                    note2: {
                        increment: rating[2] ? rating[2][0] : 0,
                    },
                    note3: {
                        increment: rating[3] ? rating[3][0] : 0,
                    },
                    note4: {
                        increment: rating[4] ? rating[4][0] : 0,
                    },
                    note5: {
                        increment: rating[5] ? rating[5][0] : 0,
                    },
                    tags: tags && JSON.stringify(tags)
                },
                include: {
                    comments: true,
                    profile: true
                }
            });
            if (report) {
                console.log(`✅ Relatório atualizado com sucesso!`);
                if (profileRating) {
                    const profile = await prismaClient.profile.update({
                        where: {
                            id: profile_id
                        },
                        data: {
                            ratings: JSON.stringify(profileRating)
                        },
                        include: {
                            reports: true
                        }
                    })
                    console.log("Perfil do usuário atualizado com sucesso.")
                    return { report, profile }
                } else {
                    return report
                }
            } else {
                console.log("❌ Ocorreu um erro ao tentar atualizar o relatório.")
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { UpdateReportService }