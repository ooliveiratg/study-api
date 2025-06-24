import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
// proccess.env.JWT_SECRET é uma variável de ambiente, criada para armazenar a chave secreta do JWT
const JWT_SECRET = process.env.JWT_SECRET

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

//login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;
    //findUnique busca um usuário
    const user = await prisma.user.findUnique({ where: {email: userInfo.email}})
    if(!user){
        res.status(404).json({ message: `Usuário não encontrado` });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password)
    

    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }
        //expiresIn serve para definir o tempo de expiração do token( 2d = 2 dias)
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {expiresIn: '2d'} )

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: `Erro no servidor: ${error}` });
  }
});

export default router;
