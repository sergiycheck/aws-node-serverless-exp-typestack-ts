import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import connectToMongoDb from './model/mongoose-db';
import { Books } from './model';
import BooksController from './controller/books';
import errorHandler from './error-handler';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/user.controller';

// https://github.com/vendia/serverless-express

export default async function createServer() {
  await connectToMongoDb();

  const app = createExpressServer({
    cors: true,
    controllers: [UserController],
  });
  app.use(express.json());
  app.disable('x-powered-by');
  app.use(errorHandler);

  app.get('/', (_, res: Response) => {
    const { event, context } = getCurrentInvoke();

    res.json(event);
  });

  const booksController = new BooksController(Books);

  return app;
}
