import prismaClient from "../prisma";

class ReadReportsWithFilterService {
    async execute(location, username, exclusionsId, profileToExcludeId, searchCount, includeInfo) {
        try {
            const reports = await prismaClient.report.findMany({
                where: {
                    OR: [
                        {
                            address: location && {
                                contains: location,
                                mode: "insensitive"
                            },
                        },
                        {
                            profile: {
                                username: username && {
                                    contains: username,
                                    mode: "insensitive"
                                },
                            },
                        }
                    ],
                    AND: [
                        {
                            id: { notIn: exclusionsId },
                        },
                        {
                            profile_id: { not: profileToExcludeId }

                        }
                    ]
                },
                take: searchCount && searchCount,
                include: includeInfo && {
                    comments: {
                        include: {
                            profile: true
                        }
                    },
                    profile: true
                }
            })
            /* const reports = await prismaClient.$queryRaw`
            CREATE EXTENSION unaccent;

            CREATE OR REPLACE FUNCTION public.immutable_unaccent(regdictionary, text)
                RETURNS text LANGUAGE c IMMUTABLE PARALLEL SAFE STRICT AS
            '$libdir/unaccent', 'unaccent_dict';

            CREATE OR REPLACE FUNCTION public.f_unaccent(text)
                RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
            $func$
            SELECT public.immutable_unaccent(regdictionary 'public.unaccent', $1)
            $func$;
            SELECT *
            FROM   reports
            WHERE  lower(f_unaccent(address)) = lower(f_unaccent(${location}));` */
            console.log(reports, `Obtivemos os ${searchCount && searchCount} primeiros relatórios com os filtros determinados.`)
            return reports;
        } catch (error) {
            console.log(error)
        }
    }
}

export { ReadReportsWithFilterService }