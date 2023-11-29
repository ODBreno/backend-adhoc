import { legislatura } from "@prisma/client";
import { prisma } from "../../../../prisma/client";
import { LegislaturaDTO } from "../../dtos/LegislaturaDTO";
import { AppError } from "../../../../errors/AppError";

export class GetLegislaturaUseCase {
  async execute(id: LegislaturaDTO["id"]): Promise<legislatura> {
    const legislatura = await prisma.legislatura.findUnique({
      where: {
        id,
      },
    });

    if (!legislatura) {
      throw new AppError("Legislatura não encontrada!");
    }

    return legislatura;
  }
}