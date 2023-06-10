import { Router } from "express";

import UserController from "../controller/UserController";

export const routes = Router();

routes.post("/users", UserController.store)