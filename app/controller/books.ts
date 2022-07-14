import { CustomLog } from './../logger/customLogger';
import { UpdateBookDTO } from './../model/dto/dtos.dto';
import { Context, APIGatewayEvent } from 'aws-lambda';
import { Model } from 'mongoose';
import { MessageUtil } from '../utils/message';
import BooksService from '../service/books';
import { CreateBookDTO } from '../model/dto/dtos.dto';

class BooksController extends BooksService {
  constructor(books: Model<any>) {
    super(books);
  }

  async create(event: APIGatewayEvent, context?: Context) {
    CustomLog.log('functionName', context.functionName);
    const params: CreateBookDTO = JSON.parse(event.body);

    try {
      const result = await this.createBook({
        ...params,
      });

      return MessageUtil.success(result);
    } catch (err) {
      CustomLog.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async update(event: APIGatewayEvent) {
    const id = Number(event.pathParameters.id);
    const body: UpdateBookDTO = JSON.parse(event.body) as UpdateBookDTO;

    try {
      const result = await this.updateBooks(id, body);
      return MessageUtil.success(result);
    } catch (err) {
      CustomLog.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async find() {
    try {
      const result = await this.findBooks();

      return MessageUtil.success(result);
    } catch (err) {
      CustomLog.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async findOne(event: APIGatewayEvent, context: Context) {
    // The amount of memory allocated for the function

    CustomLog.log('memoryLimitInMB: ', context.memoryLimitInMB);

    const id = Number(event.pathParameters.id);

    try {
      const result = await this.findOneBookById(id);

      return MessageUtil.success(result);
    } catch (err) {
      CustomLog.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async deleteOne(event: APIGatewayEvent) {
    const { id } = event.pathParameters;

    try {
      const result = await this.deleteOneBookById(Number(id));

      if (result.deletedCount === 0) {
        return MessageUtil.error(
          1010,
          'The data was not found! May have been deleted!'
        );
      }

      return MessageUtil.success(result);
    } catch (err) {
      CustomLog.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }
}

export default BooksController;
