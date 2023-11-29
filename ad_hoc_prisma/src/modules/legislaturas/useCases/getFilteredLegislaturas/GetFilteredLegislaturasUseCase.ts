import { legislatura } from "@prisma/client";
import { AppError } from "../../../../errors/AppError";
import { prisma } from "../../../../prisma/client";
import { FilteredLegislaturasDTO } from "../../dtos/FilteredLegislaturasDTO";

export class GetFilteredLegislaturasUseCase {
  async execute({ attributes, filters }: FilteredLegislaturasDTO): Promise<legislatura[]> {
    if (!attributes || !filters) {
      throw new AppError("Atributos não encontrados", 404);
    }

    const select =
      attributes.length > 0
        ? attributes.reduce((acc: Record<string, any>, attribute) => {
            if (attribute.table === "legislatura") {
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
            if (filter.table === "legislatura") {
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

    const legislatura =
      select && where
        ? await prisma.legislatura.findMany({
            select,
            where,
          })
        : !select && where
        ? await prisma.legislatura.findMany({
            where,
          })
        : !where && select
        ? await prisma.legislatura.findMany({
            select,
          })
        : await prisma.legislatura.findMany();

    if (!legislatura) {
      throw new AppError("Legislaturas não encontradas", 404);
    }

    return legislatura as legislatura[];
  }
}