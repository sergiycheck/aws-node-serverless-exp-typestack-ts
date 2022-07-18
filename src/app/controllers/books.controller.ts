import { VendiaSlsService } from './../service/vendia-serveless.service';
import { CustomLog } from '../logger/customLogger';
import { UpdateBookDTO } from '../model/dto/dtos.dto';
import { MessageUtil } from '../utils/message';
import BooksService from '../service/books.service';
import { CreateBookDTO } from '../model/dto/dtos.dto';
import { Service } from 'typedi';
import {
  Controller,
  Post,
  UseBefore,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from 'routing-controllers';
import { loggingMiddleware } from '../middlewares/logger.middleware';
import { Response } from 'express';
import { jsonParser } from '../middlewares/jsonParser.middleware';

@Controller()
@Service()
@UseBefore(loggingMiddleware)
@UseBefore(jsonParser)
//TODO: can not useAfterMiddleware
// Cannot set headers after they are sent to the client
class BooksController {
  constructor(
    protected booksService: BooksService,
    protected messageUtil: MessageUtil,
    protected vendiaSlsService: VendiaSlsService
  ) {}

  @Post('/books')
  async create(@Body() params: CreateBookDTO, @Res() res: Response) {
    const { event, context } = this.vendiaSlsService.callGetCurrentInvoke();
    CustomLog.log('functionName', context.functionName);

    try {
      const result = await this.booksService.createBook({
        ...params,
      });

      return this.messageUtil.success(result, res);
    } catch (err) {
      CustomLog.error(err);

      return this.messageUtil.error(err.code, err.message, res);
    }
  }

  @Put('/books/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateBookDTO,
    @Res() res: Response
  ) {
    try {
      const result = await this.booksService.updateBooks(id, body);
      return this.messageUtil.success(result, res);
    } catch (err) {
      CustomLog.error(err);

      return this.messageUtil.error(err.code, err.message, res);
    }
  }

  @Get('/books')
  async find(@Res() res: Response) {
    try {
      const result = await this.booksService.findBooks();

      return this.messageUtil.success(result, res);
    } catch (err) {
      CustomLog.error(err);

      return this.messageUtil.error(err.code, err.message, res);
    }
  }

  @Get('/books/:id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const { context } = this.vendiaSlsService.callGetCurrentInvoke();
    CustomLog.log('memoryLimitInMB: ', context.memoryLimitInMB);

    try {
      const result = await this.booksService.findOneBookById(id);

      return this.messageUtil.success(result, res);
    } catch (err) {
      CustomLog.error(err);

      return this.messageUtil.error(err.code, err.message, res);
    }
  }

  @Delete('/books/:id')
  async deleteOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.booksService.deleteOneBookById(id);

      if (result.deletedCount === 0) {
        return this.messageUtil.error(
          1010,
          'The data was not found! May have been deleted!',
          res
        );
      }

      return this.messageUtil.success(result, res);
    } catch (err) {
      CustomLog.error(err);

      return this.messageUtil.error(err.code, err.message, res);
    }
  }
}

export default BooksController;
