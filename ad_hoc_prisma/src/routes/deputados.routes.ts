import { Router } from "express";
import { GetDeputadosController } from "../modules/deputados/useCases/getAllDeputados/GetAllDeputadosController";

const getDeputadosController = new GetDeputadosController();
const deputadosRoutes = Router()

deputadosRoutes.get('/', getDeputadosController.handle);

export { deputadosRoutes };