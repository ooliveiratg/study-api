import express from 'express';
import publicRoutes from './routes/public.js';
import { PrismaClient } from './generated/prisma/index.js'
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.use('/',publicRoutes)

app.use('/',auth,privateRoutes)



app.listen(3000,() => console.log("servidor rodando"))

//mongodb+srv://oliveira:th161106@users.vtvyxxz.mongodb.net/?retryWrites=true&w=majority&appName=Users