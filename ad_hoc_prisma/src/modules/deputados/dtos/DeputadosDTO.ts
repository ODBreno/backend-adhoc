import { despesas, legislatura, deputado_orgao, evento_deputado } from "@prisma/client";

export interface DeputadosDTO {
    id: number;
    nome: string;
    siglaPartido: string;
    siglauf: string;
    idlegislatura: number;
    deputado_orgao: deputado_orgao[];
    legislatura: legislatura;
    despesas: despesas [];
    evento_deputado: evento_deputado[];
}