import { Request, Response } from 'express';
import { GetDeputadoUseCase } from './GetDeputadoUseCase';

export class GetDeputadoController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const getDeputadoUseCase = new GetDeputadoUseCase();
        const result = await getDeputadoUseCase.execute(Number(id));

        return res.status(200).json(result);
    }
}