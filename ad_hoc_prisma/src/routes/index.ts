import { Router } from "express";
import { deputadosRoutes } from "./deputados.routes";
import { legislaturaRoutes } from "./legislatura.routes";

const routes = Router();

routes.use("/deputados", deputadosRoutes);
routes.use("/legislatura", legislaturaRoutes);

export { routes };