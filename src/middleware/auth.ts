import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { userRepository } from "../controller/UserController";
import authConfig from "../config/authConfig";

interface JwtPayload {
  id: number
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return res.status(401).json({ message: "Token not exist" });
  }

  const [, token] = authHeader.split(" ");

  try{
    const {id} = jwt.verify(token, authConfig.secret) as JwtPayload

    const user = await userRepository.findOne({ where: { id: id } });

    if(user.id !== id) {
      return res.status(401).json({ message: "User not exist" });
    }
    
    return next();
  } catch(err) {
    return res.status(401).json({ message: "Token invalid" });
  }
}