import { Router } from "express";
import { GetFilteredLegislaturasController } from "../modules/legislaturas/useCases/getFilteredLegislaturas/GetFilteredLegislaturasController";
import { GetAllLegislaturasController } from "../modules/legislaturas/useCases/getAllLegislaturas/getAllLegislaturasController";
import { GetLegislaturaController } from "../modules/legislaturas/useCases/getLegislatura/GetLegislaturaController";

const getAllLegislaturasController = new GetAllLegislaturasController();
const getLegislaturaController = new GetLegislaturaController();
const getFilteredLegislaturasController = new GetFilteredLegislaturasController();
const legislaturaRoutes = Router()

legislaturaRoutes.get('/', getAllLegislaturasController.handle);
legislaturaRoutes.get('/id/:id', getLegislaturaController.handle);
legislaturaRoutes.get('/filters', getFilteredLegislaturasController.handle);

export { legislaturaRoutes };