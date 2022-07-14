import 'reflect-metadata';
import express, { Response } from 'express';
import connectToMongoDb from './model/mongoose-db';
import { BookModelName, Books } from './model';
import errorHandler from './error-handler';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import BooksController from './controllers/books.controller';

export default async function createServer() {
  await connectToMongoDb();

  useContainer(Container);

  Container.set(BookModelName, Books);

  const app = createExpressServer({
    cors: true,
    controllers: [BooksController],
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204,
      paramOptions: {
        required: true,
      },
    },
  });
  app.use(express.json());
  app.disable('x-powered-by');
  app.use(errorHandler);

  app.get('/', (_, res: Response) => {
    const { event, context } = getCurrentInvoke();

    res.json(event);
  });

  return app;
}
