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

import serverlessExpress from '@vendia/serverless-express';
import createServer from './app';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

let serverlessExpressInstance;

async function setup(event: APIGatewayEvent, context: Context) {
  const app = await createServer();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

const handler: Handler = (event: APIGatewayEvent, context: Context) => {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);

  return setup(event, context);
};

module.exports.handler = handler;
