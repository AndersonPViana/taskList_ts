import { Router } from "express";

import authMiddleware from "../middleware/auth";

import UserController from "../controller/UserController";
import SessionController from "../controller/SessionController";

export const routes = Router();

// Users
routes.post("/users", UserController.store);

// Sessions
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);
// Users
routes.put("/users", UserController.update);