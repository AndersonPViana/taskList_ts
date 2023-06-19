import { Request, Response } from "express";
import * as Yup from "yup";

import { Task } from "../entity/Task";
import { AppDataSource } from "../data-source";
import SessionController from "./SessionController";
import { userRepository } from "./UserController";

export const taskRepository = AppDataSource.getRepository(Task);

class TaskController {
  async update(req: Request, res: Response) {
    const { id_task } = req.params;
    const { check } = req.body;

    const tokenId = SessionController.tokenId;

    const id = await tokenId(req.headers.authorization);

    if(!id) {
      return res.status(400).json({ message: "token not exist" });
    }

    const tasks = await taskRepository.find({ relations: { user: true } });

    const taskUser = tasks.filter((task) => {
      if(task.user.id === id && task.id === Number(id_task)) {
        return task;
      }
    })

    if(taskUser.length === 0) {
      return res.status(400).json({ message: "task does not belong to the user" })
    }

    await taskRepository.update(id_task, {check: check});

    return res.status(200).json({ message: "successfully updated task" });
  }

  async deleta(req: Request, res: Response) {
    const { id_task } = req.params;

    const tokenId = SessionController.tokenId;

    const id = await tokenId(req.headers.authorization);

    if(!id) {
      return res.status(400).json({ message: "token not exist" });
    }

    const tasks = await taskRepository.find({ relations: { user: true } });

    const taskUser = tasks.filter((task) => {
      if(task.user.id === id && task.id === Number(id_task)) {
        return task;
      }
    })

    if(taskUser.length === 0) {
      return res.status(400).json({ message: "task does not belong to the user" })
    }

    await taskRepository.delete(id_task);

    res.status(200).json({ message: "deleted task" })
  }

  async index(req: Request, res: Response): Promise<any> {
    const tokenId = SessionController.tokenId;

    const id = await tokenId(req.headers.authorization);

    if(!id) {
      return res.status(400).json({ message: "Token not exist" });
    }

    const tasks = await taskRepository.find({ relations: { user: true } });

    const tasksUser = tasks.filter((task) => { 
      if(task.user.id === id && task.check === false) {
        return task.task;
      }  
    });

    res.json(tasksUser);
  }

  async store(req: Request, res: Response): Promise<any> {  
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: "failed to register" });
    }

    const tokenId = SessionController.tokenId;

    const id = await tokenId(req.headers.authorization);

    const user = await userRepository.findOne({ where: { id: id } });

    if(!user){
      return res.status(400).json({ message: "User not exist" });
    }

    const { task, check } = req.body;

    const newTask = new Task(task, check, user);

    await taskRepository.save(newTask);

    res.json(newTask.task);
  }
}

export default new TaskController();