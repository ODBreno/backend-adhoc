import { deputados } from "@prisma/client";
import { AppError } from "../../../../errors/AppError";
import { prisma } from "../../../../prisma/client";
import { FilteredDeputadosDTO } from "../../dtos/FilteredDeputadosDTO";

export class GetFilteredDeputadosUseCase {
  async execute({ attributes, filters }: FilteredDeputadosDTO): Promise<deputados[]> {
    if (!attributes || !filters) {
      throw new AppError("Atributos não encontrados", 404);
    }

    const select =
      attributes.length > 0
        ? attributes.reduce((acc: Record<string, any>, attribute) => {
            if (attribute.table === "deputados") {
              return {
                ...acc,
                [attribute.column]: true,
              };
            }

            return {
              ...acc,
              [attribute.table]: {
                select: {
                  ...acc[attribute.table]?.select,
                  [attribute.column]: true,
                },
              },
            };
          }, {})
        : null;

    const where =
      filters.length > 0
        ? filters.reduce((acc, filter) => {
            if (filter.table === "deputados") {
              return {
                ...acc,
                [filter.column]: {
                  [filter.operator]: filter.value,
                },
              };
            }

            return {
              ...acc,
              [filter.table]: {
                [filter.column]: {
                  [filter.operator]: filter.value,
                },
              },
            };
          }, {})
        : null;

    const deputados =
      select && where
        ? await prisma.deputados.findMany({
            select,
            where,
          })
        : !select && where
        ? await prisma.deputados.findMany({
            where,
          })
        : !where && select
        ? await prisma.deputados.findMany({
            select,
          })
        : await prisma.deputados.findMany();

    if (!deputados) {
      throw new AppError("Deputados não encontrados", 404);
    }

    return deputados as deputados[];
  }
}