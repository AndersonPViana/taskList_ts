import { Router } from "express";

import UserController from "../controller/UserController";
import SessionController from "../controller/SessionController";
import TaskController from "../controller/TaskController";

export const routes = Router();

// Users
routes.post("/users", UserController.store);

// Sessions
routes.post("/sessions", SessionController.store);

// Tasks
routes.post("/tasks", TaskController.store);
routes.get("/tasks", TaskController.index);
