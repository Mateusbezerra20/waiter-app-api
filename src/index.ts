import path from 'node:path';
import http from 'node:http';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import { router } from './router';

dotenv.config();

mongoose.set('strictQuery', false);

const app = express();
const server = http.createServer(app);
export const io = new Server(server);

mongoose.connect(`mongodb+srv://mateusmba20:${process.env.PASSWORD}@waiterapp.v7d58po.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    // Após fazer a conexão com o mongodb, executar o servidor da api

    const port = 3001;

    // Resolvendo o problema com cors
    app.use((req, resp, next) => {
      resp.setHeader('Access-Control-Allow-Origin', '*');
      resp.setHeader('Access-Control-Allow-Methods', '*');
      resp.setHeader('Access-Control-Allow-Headers', '*');

      next();
    });

    // rota /uploads serve arquivos estáticos
    app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
    app.use(express.json());
    app.use(router);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(() => console.log('Erro ao conectar ao Mongodb'));


