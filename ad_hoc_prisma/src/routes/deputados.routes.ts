import { Router } from "express";
import { GetFilteredDeputadosController } from "../modules/deputados/useCases/getFilteredDeputados/GetFilteredDeputadosController";
import { GetAllDeputadosController } from "../modules/deputados/useCases/getAllDeputados/GetAllDeputadosController";
import { GetDeputadoController } from "../modules/deputados/useCases/getDeputado/GetDeputadoController";

const getAllDeputadosController = new GetAllDeputadosController();
const getDeputadoController = new GetDeputadoController();
const getFilteredDeputadosController = new GetFilteredDeputadosController();
const deputadosRoutes = Router()

deputadosRoutes.get('/', getAllDeputadosController.handle);
deputadosRoutes.get('/id/:id', getDeputadoController.handle);
deputadosRoutes.get('/filters', getFilteredDeputadosController.handle);

export { deputadosRoutes };