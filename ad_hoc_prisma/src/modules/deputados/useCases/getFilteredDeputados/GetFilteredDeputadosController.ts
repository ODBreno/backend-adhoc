import { Request, Response } from "express";
import { GetFilteredDeputadosUseCase } from "./GetFilteredDeputadosUseCase";

export class GetFilteredDeputadosController {
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
      "deputados.id",
      "deputados.idLegislatura",
    ];

    const handledFilters = arrayFiltros.map((filter) => {
      const [table, column, operator, oldValue] = filter.split(".");
      let value;
      if (numberFilters.includes(`${table}.${column}`)) {
        value = Number(oldValue);
      } else {
        value = oldValue;
      }

      return { table, column, operator, value };
    });

    const getFilteredDeputadosUseCase = new GetFilteredDeputadosUseCase();

    const deputados = await getFilteredDeputadosUseCase.execute({
      attributes: separatedAttributes,
      filters: handledFilters,
    });

    return response.json(deputados);
  }
}