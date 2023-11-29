import { Request, Response } from 'express';
import { GetLegislaturaUseCase } from './GetLegislaturaUseCase';

export class GetLegislaturaController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const getLegislaturaUseCase = new GetLegislaturaUseCase();
        const result = await getLegislaturaUseCase.execute(Number(id));

        return res.status(200).json(result);
    }
}