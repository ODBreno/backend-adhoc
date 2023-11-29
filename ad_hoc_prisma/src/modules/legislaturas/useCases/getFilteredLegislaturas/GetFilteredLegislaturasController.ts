import { Request, Response } from "express";
import { GetFilteredLegislaturasUseCase } from "./GetFilteredLegislaturasUseCase";

export class GetFilteredLegislaturasController {
   async handle(request: Request, response: Response): Promise<Response> {
    const { attributes, filters } = request.query;

    const arrayAtributos =
      attributes
        ?.toString()
        .split(",")
        .filter((attribute) => attribute !== "") ?? [];
    const arrayFiltros =
      filters
        ?.toString()
        .split(",")
        .filter((filter) => filter !== "") ?? [];

    const separatedAttributes = arrayAtributos.map((attribute) => {
      const [table, column] = attribute.split(".");
      return { table, column };
    });

    const numberFilters = [
      "legislatura.id",
    ];

    const dataFilters = [
        "legislatura.datainicio",
        "legislatura.datafim",
      ];

    const handledFilters = arrayFiltros.map((filter) => {
      const [table, column, operator, oldValue] = filter.split(".");
      let value;
      if (numberFilters.includes(`${table}.${column}`)) {
        value = Number(oldValue);
      }else if (dataFilters.includes(`${table}.${column}`)) {
        // Se for uma data, parse para o formato Date
        value = new Date(oldValue);
      } else {
        value = oldValue;
      }

      return { table, column, operator, value };
    });

    const getFilteredLegislaturasUseCase = new GetFilteredLegislaturasUseCase();

    const legislatura = await getFilteredLegislaturasUseCase.execute({
      attributes: separatedAttributes,
      filters: handledFilters,
    });

    return response.json(legislatura);
  }
}