import prismaClient from "../prisma";

class ReadProfilesWithFilterService {
    async execute(location, username, exclusionsId, searchCount) {
        try {
            const reports = await prismaClient.profile.findMany({
                where: {
                    OR: [
                        {
                            defaultCity: {
                                contains: location,
                                mode: "insensitive"
                            },
                        },
                        {
                            username: {
                                contains: username,
                                mode: "insensitive"
                            },
                        }
                    ],
                    AND: [
                        {
                            id: { notIn: exclusionsId },
                        },
                    ]
                },
                take: searchCount && searchCount,
            })
            console.log(reports, `Obtivemos os ${searchCount && searchCount} primeiros usuários com os filtros determinados.`)
            return reports;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadProfilesWithFilterService }