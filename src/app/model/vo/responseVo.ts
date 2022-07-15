export class ResponseBodyVO {
  code: number;

  message: string;

  data?: object;
}

export class ResponseVO {
  statusCode: number;

  body: string;
}

export class ResponseBook {
  _id: string;
  name: string;
  id: number;
  createdAt: string;
  __v: number;
  description: string;
}
