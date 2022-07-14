import { ReturnedDataModifier } from './data-interceptor.interceptor';
import { getCurrentInvoke } from '@vendia/serverless-express';

import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  UseBefore,
  UseAfter,
  UseInterceptor,
  Action,
} from 'routing-controllers';

import compression from 'compression';
import {
  loggingMiddleware,
  ResponseLogger,
} from '../middlewares/logger.middleware';

@Controller()
@UseBefore(compression())
@UseBefore(loggingMiddleware)
@UseAfter(ResponseLogger)
export class UserController {
  @Get('/users')
  getAll() {
    return 'This action returns all users';
  }

  @Get('/users/curr-invoke')
  getAllUsers(@Req() request: any, @Res() response: any) {
    const { event, context } = getCurrentInvoke();
    return response.json({ message: 'users invoke handler', event, context });
  }

  @Get('/users/:id')
  // @UseInterceptor(function (action: Action, content: any) {
  //   content['addedProp'] = {
  //     data: 'useful data',
  //   };

  //   return content;
  // })
  //or
  // can register per controller, per method or globally
  @UseInterceptor(ReturnedDataModifier)
  getOne(@Param('id') id: number) {
    return { message: 'This action returns user #' + id };
  }

  @Post('/users')
  post(@Body() user: any) {
    return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}
