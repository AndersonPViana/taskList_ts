import { Request, Response } from "express";
import * as Yup from "yup";

import { Task } from "../entity/Task";
import { AppDataSource } from "../data-source";
import SessionController from "./SessionController";
import { userRepository } from "./UserController";

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

    const id = await tokenId(req.headers.authorization);

    const user = await userRepository.findOne({ where: { id: id } })

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