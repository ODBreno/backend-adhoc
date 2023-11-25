import { deputados } from "@prisma/client";
import { prisma } from "../../../../prisma/client";

export class GetAllDeputadosUseCase {
    async execute(): Promise<deputados[]> {
        const deputados = await prisma.deputados.findMany();
        return deputados;
    }
}