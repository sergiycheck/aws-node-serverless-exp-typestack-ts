import { Response } from 'express';
import { Service } from 'typedi';
import { CustomLog } from '../logger/customLogger';
import { ResponseVO } from '../model/vo/responseVo';

enum StatusCode {
  success = 200,
}

@Service()
export class Result {
  public statusCode: number;

  public code: number;

  public message: string;

  public data?: any;

  setResponseData(
    statusCode: number,
    code: number,
    message: string,
    data?: any
  ) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  getDataToObj() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString(res: Response) {
    return res.status(this.statusCode).json(this.getDataToObj());
  }
}

@Service()
export class MessageUtil {
  constructor(public result: Result) {}

  success(data: object, res: Response) {
    this.result.setResponseData(StatusCode.success, 0, 'success', data);

    return this.result.bodyToString(res);
  }

  error(code = 1000, message: string, res: Response) {
    const result = this.result.setResponseData(
      StatusCode.success,
      code,
      message
    );

    CustomLog.log(this.result.getDataToObj());

    return this.result.bodyToString(res);
  }
}
