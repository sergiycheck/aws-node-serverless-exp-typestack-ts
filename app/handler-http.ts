import dotenv from 'dotenv';
import path from 'path';

const dotenvPath = path.join(
  __dirname,
  '../',
  `config/.env.${process.env.NODE_ENV}`
);
dotenv.config({
  path: dotenvPath,
});

import serverless from 'serverless-http';
import express, { Request, Response, NextFunction } from 'express';
import connectToMongoDb from './model/mongoose-db';
import { Books } from './model';
import BooksController from './controller/books';

connectToMongoDb();

const app = express();
app.use(express.json());

const booksController = new BooksController(Books);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: 'Hello from root!',
  });
});

app.get('/hello', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: 'Hello from path!',
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

module.exports.handler = serverless(app);
