import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as Yup from "yup";

import { Task } from "../entity/Task";
import { AppDataSource } from "../data-source";
import { userRepository } from "./UserController";
import SessionController from "./SessionController";


export const taskRepository = AppDataSource.getRepository(Task);

class TaskController {
  async store(req: Request, res: Response) {  
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: "failed to register" });
    }

    const tokenId = SessionController.tokenId;

    const id = tokenId(req.headers.authorization);

    if(!id) {
      return res.status(401).json({ message: "Token not exist" });
    }

    const idNumber = Number(id);

    const user = await userRepository.findOne({where: { id: idNumber }});

    if(!user){
      return res.status(401).json({ message: "User not exist" });
    }

    const { task, check } = req.body;

    const newTask = new Task(task, check, user);

    await taskRepository.save(newTask);

    res.json(newTask.task);
  }
}

export default new TaskController();