import { deputados } from "@prisma/client";

export interface LegislaturaDTO {
    id: number;
    datainicio: string;
    datafim: string;
    deputados: deputados[];
}