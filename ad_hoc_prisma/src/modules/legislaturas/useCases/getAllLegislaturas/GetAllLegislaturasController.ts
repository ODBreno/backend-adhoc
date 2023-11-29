import { Request, Response } from 'express';
import { GetAllLegislaturasUseCase } from './GetAllLegislaturasUseCase';

export class GetAllLegislaturasController {
    async handle(req: Request, res: Response){
        const getLegislaturasUseCase = new GetAllLegislaturasUseCase();
        const result = await getLegislaturasUseCase.execute();

        return res.status(200).json(result);
    }
}