import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as Yup from "yup";

import { Task } from "../entity/Task";
import authConfig from "../config/authConfig";
import { AppDataSource } from "../data-source";
import { userRepository } from "./UserController";

interface JwtPayload {
  id: number
}

export const taskRepository = AppDataSource.getRepository(Task);

class TaskController {
  async store(req: Request, res: Response) {  
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: "failed to register" });
    }

    const authHeader = req.headers.authorization;

    if(!authHeader) {
      return res.status(401).json({ message: "Token not exist" });
    }

    const [, token] = authHeader.split(" ");

    const { id } = jwt.verify(token, authConfig.secret) as JwtPayload;

    const user = await userRepository.findOne({where: {id: id}});

    if(!user){
      return res.status(401).json({ message: "User not exist" });
    }

    const { task, check } = req.body;

    const newTask = new Task(task, check, user);

    res.json(newTask.task);
  }
}

export default new TaskController();