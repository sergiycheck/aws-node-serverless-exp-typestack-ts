import { Request, Response, NextFunction } from 'express';
import { CustomLog } from './../logger/customLogger';

import { ExpressMiddlewareInterface } from 'routing-controllers';

export function loggingMiddleware(
  request: Request,
  response: Response,
  next?: NextFunction
): any {
  CustomLog.log(`method: ${request.method}, path: ${request.originalUrl}`);
  next();
}
