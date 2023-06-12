import { Router } from "express";

import UserController from "../controller/UserController";
import SessionController from "../controller/SessionController";

export const routes = Router();

// Users
routes.post("/users", UserController.store);

// Sessions
routes.post("/sessions", SessionController.store);