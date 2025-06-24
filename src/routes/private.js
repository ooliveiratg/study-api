import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/list',async (req,res)=> {
    try{
        const users = await prisma.user.findMany({omit: {password: true}}); 
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ message: `Erro ao listar usuários: ${error}` });
    }
})

export default router;


