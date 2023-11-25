import { Request, Response } from 'express';
import { GetAllDeputadosUseCase } from './GetAllDeputadosUseCase';

export class GetAllDeputadosController {
    async handle(req: Request, res: Response){
        const getDeputadosUseCase = new GetAllDeputadosUseCase();
        const result = await getDeputadosUseCase.execute();

        return res.status(200).json(result);
    }
}