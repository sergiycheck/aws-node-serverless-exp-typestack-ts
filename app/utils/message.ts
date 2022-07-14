import { CustomLog } from '../logger/customLogger';
import { ResponseVO } from '../model/vo/responseVo';

enum StatusCode {
  success = 200,
}

export class Result {
  public statusCode: number;

  public code: number;

  public message: string;

  public data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

export class MessageUtil {
  static success(data: object): ResponseVO {
    const result = new Result(StatusCode.success, 0, 'success', data);

    return result.bodyToString();
  }

  static error(code = 1000, message: string) {
    const result = new Result(StatusCode.success, code, message);

    CustomLog.log(result.bodyToString());
    return result.bodyToString();
  }
}
