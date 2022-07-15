import 'reflect-metadata';
import { Response } from 'express';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import BooksController from './controllers/books.controller';
import errorHandler from './error-handler';
import connectToMongoDb from './model/mongoose-db';
import { BookModelName, Books } from './model';
import {
  jsonParser,
  urlEncodedParser,
} from './middlewares/jsonParser.middleware';

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

  app.use(urlEncodedParser);
  app.use(jsonParser);

  app.disable('x-powered-by');
  app.use(errorHandler);

  app.get('/', (_, res: Response) => {
    const { event, context } = getCurrentInvoke();

    res.json(event);
  });

  return app;
}
