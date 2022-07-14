import { Request, Response, NextFunction } from 'express';
import { CustomLog } from './../logger/customLogger';

import { ExpressMiddlewareInterface } from 'routing-controllers';

export function loggingMiddleware(
  request: Request,
  response: Response,
  next?: NextFunction
): any {
  CustomLog.log(`method: ${request.method}, path: ${request.path}`);
  next();
}

export class ResponseLogger implements ExpressMiddlewareInterface {
  // interface implementation is optional

  logResponseBody(originalBodyArrOfBuffers: Buffer[]) {
    // can not modify a response because headers're sent

    let notEmptyBodyBuff: Buffer;
    if (Array.isArray(originalBodyArrOfBuffers)) {
      for (let item of originalBodyArrOfBuffers) {
        if (item.length) {
          notEmptyBodyBuff = item;
        }
      }
    }

    try {
      const data = JSON.parse(notEmptyBodyBuff.toString());
      CustomLog.log(`response data `, data);
    } catch (error) {
      CustomLog.error(error);
    }

    return;
  }

  use(request: Request, response: Response, next?: NextFunction): any {
    const symbols = Object.getOwnPropertySymbols(response);
    const responseSymbolBodyKey = symbols[symbols.length - 2];

    const originalBodyArrOfBuffers = response[
      responseSymbolBodyKey
    ] as Buffer[];

    this.logResponseBody(originalBodyArrOfBuffers);
    return next();
  }
}
