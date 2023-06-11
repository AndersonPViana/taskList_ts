import { userRepository } from "./UserController";

class SessionController {
  async store(req, res) {
    const { email, password_hash } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if(!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    
  }
}