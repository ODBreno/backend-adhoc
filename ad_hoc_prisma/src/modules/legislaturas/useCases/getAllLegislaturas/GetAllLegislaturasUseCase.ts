import { legislatura } from "@prisma/client";
import { prisma } from "../../../../prisma/client";

export class GetAllLegislaturasUseCase {
    async execute(): Promise<legislatura[]> {
        const legislaturas = await prisma.legislatura.findMany();
        return legislaturas;
    }
}