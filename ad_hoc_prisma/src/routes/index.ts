import { Router } from "express";
import { deputadosRoutes } from "./deputados.routes";

const routes = Router();

routes.use("/deputados", deputadosRoutes);

export { routes };