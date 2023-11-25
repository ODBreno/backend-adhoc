import { deputados } from "@prisma/client";
import { prisma } from "../../../../prisma/client";
import { DeputadosDTO } from "../../dtos/DeputadosDTO";
import { AppError } from "../../../../errors/AppError";

export class GetDeputadoUseCase {
  async execute(id: DeputadosDTO["id"]): Promise<deputados> {
    const deputado = await prisma.deputados.findUnique({
      where: {
        id,
      },
    });

    if (!deputado) {
      throw new AppError("Deputado não encontrado!");
    }

    return deputado;
  }
}