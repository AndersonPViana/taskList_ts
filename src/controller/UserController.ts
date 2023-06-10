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

    const newUser = new User();

    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password_hash = req.body.password_hash;

    try {
      await userRepository.save(newUser);
    } catch(err) {
      return res.status(400).json({ message: "Something went wrong with the upload" })
    }

    const {id, name, email} = newUser;

    return res.json({
      id,
      name, 
      email
    })
  }
}