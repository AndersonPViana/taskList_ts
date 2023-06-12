import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { userRepository } from "./UserController";
import authConfig from "../config/authConfig";

class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if(!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if(!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { id, name } = user;

    return res.json({
     user: { 
        id,
        name,
        email 
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();