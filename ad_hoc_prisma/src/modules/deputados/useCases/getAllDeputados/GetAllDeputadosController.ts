import { Request, Response } from 'express';
import { GetAllDeputadosUseCase } from './GetAllDeputadosUseCase';

export class GetDeputadosController {
    async handle(req: Request, res: Response){
        const getDeputadosUseCase = new GetAllDeputadosUseCase();
        const result = await getDeputadosUseCase.execute({});

        return res.status(201).json(result);
    }
}