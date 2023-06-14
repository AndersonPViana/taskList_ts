import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as Yup from "yup";
import * as bcrypt from "bcrypt";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import SessionController from "./SessionController";

export const userRepository = AppDataSource.getRepository(User);

class UserController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8)
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ message: "validation failure" });
    }

    const { id, name, email, password} = req.body;

    const userExist = await userRepository.findOne({ where: { email } });

    if(userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 8);
    
    const newUser = new User(name, email, password_hash);

    try {
      await userRepository.save(newUser);
    } catch(err) {
      return res.status(400).json({ message: "Something went wrong with the upload" });
    }

    return res.json({
      id,
      name, 
      email
    })
  }

  async update(req: Request, res: Response) {
    const tokenId = SessionController.tokenId;

    const id = await tokenId(req.headers.authorization);

    if(!id) {
      return res.status(401).json({ message: "Token not exist" });
    }

    const user = await userRepository.findOne({ where: {id: id} });

    const { email, oldPassword, password } = req.body;

    if(email !== user.email) {
      const userExist = await userRepository.findOne({
        where: { email },
      })

      if(userExist) {
        return res.status(400).json({ message: "user already exists" })
      }
    }

    if(oldPassword && !(await bcrypt.compare(oldPassword, user.password_hash))){
      return res.status(401).json({ message: "incorrect password" });
    }

    const newPassword = await bcrypt.hash(password, 8);

    await userRepository.update(id, { password_hash: newPassword });

    res.status(200).json({ message: "updated password" })
  }
}

export default new UserController();