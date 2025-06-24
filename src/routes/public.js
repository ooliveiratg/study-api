import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from '../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient()

router.post("/cadastro", async (req, res) => {
  try {
    //recebe os dados do usuário
    const user = req.body;
    //nivel de incriptação
    //não é muito recomendo usar um nivel muito alto, pois pode causar lentidão no servidor
    const salt = await bcrypt.genSalt(10);
    //senha criptografada
    const hashedPassword = await bcrypt.hash(user.password, salt);

   const userDB = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
    res.status(201).json(userDB);
  } catch (error) {
    res.status(500).json({ message: `Erro ao criar usuário ${error}` });
  }
});

export default router;
