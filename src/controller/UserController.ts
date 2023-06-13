import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as Yup from "yup";
import * as bcrypt from "bcrypt";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import authConfig from "../config/authConfig";

interface JwtPayload {
  id: number
}

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
}

export default new UserController();