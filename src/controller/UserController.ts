import * as express from "express";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User)

export class UserController {
  async store(req, res) {
    const userExist = await userRepository.findOne({
      where: { email: req.body.email }
    })

    if(userExist) {
      return res.status(400).json({ message: "User already exists" })
    }
  }
}