import { VendiaSlsService } from './../src/app/service/vendia-serveless.service';
import { UpdateBookDTO } from './../src/app/model/dto/dtos.dto';
import 'reflect-metadata';
import { Container } from 'typedi';
import * as bookMocks from '../mocks/books.mock';
import BooksController from '../src/app/controllers/books.controller';
import BooksService from '../src/app/service/books.service';
import { CreateBookDTO } from '../src/app/model/dto/dtos.dto';
import { BookModelName, Books } from '../src/app/model';
import _ from 'lodash';
import { FakeVendiaSlsService } from './fakeServices';

describe('mock service methods, test methods of controller', () => {
  let booksController: BooksController;
  let booksService: BooksService;
  let fakeVendiaSlsService: FakeVendiaSlsService;

  const resMock: any = {
    code: null,
    response: null,
    status: function (code: number) {
      this.code = code;
      return this;
    },
    json: function (data: any) {
      this.response = data;
    },
  };

  beforeAll(() => {
    Container.set(BookModelName, Books);
    booksService = Container.get(BooksService);
    // const msgUtil = Container.get(MessageUtil);
    fakeVendiaSlsService = new FakeVendiaSlsService();

    Container.set(VendiaSlsService, fakeVendiaSlsService);
    // booksController = new BooksController(booksService, msgUtil);

    booksController = Container.get(BooksController);
  });

  // test('long runing test because of compiling ts and rewiring private members', async () => {
  //   const fullPath = path.resolve(
  //     __dirname,
  //     '../src/app/controllers/books.controller'
  //   );
  //   let controllerModule = rewire(fullPath) as ReturnType<typeof rewire> & {
  //     default: BooksController;
  //   };

  //   let getCurrentInvokeMock = function () {
  //     return {
  //       event: {},
  //       context: { functionName: 'create' },
  //     };
  //   };

  //   controllerModule.__set__('@vendia/serverless-express', {
  //     getCurrentInvoke: getCurrentInvokeMock,
  //   });

  //   const { _id, __v, createdAt, ...data } = bookMocks.create;

  //   const params: CreateBookDTO = {
  //     ...data,
  //   };

  //   const resMock: any = {
  //     code: null,
  //     response: null,
  //     status: function (code: number) {
  //       this.code = code;
  //     },
  //     json: function (data: any) {
  //       this.response = data;
  //     },
  //   };

  //   Container.set(BookModelName, Books);
  //   let booksService = Container.get(BooksService);

  //   const spyCreateBook = jest
  //     .spyOn(booksService, 'createBook')
  //     .mockImplementation(() => Promise.resolve(bookMocks.create));

  //   const msgUtil = Container.get(MessageUtil);
  //   let booksController = new BooksController(booksService, msgUtil);

  //   controllerModule.default = booksController;

  //   const res = await controllerModule.default.create(params, resMock);

  //   expect(spyCreateBook).toHaveBeenCalled();

  //   expect(resMock.response).toStrictEqual(bookMocks.create);

  //   spyCreateBook.mockRestore();
  // });

  test('mock create book', async () => {
    const { _id, __v, createdAt, ...data } = bookMocks.create;

    const params: CreateBookDTO = {
      ...data,
    };

    const spyFakeVendiaSlsService = jest
      .spyOn(fakeVendiaSlsService, 'callGetCurrentInvoke')
      .mockImplementation(() => ({
        event: {},
        context: {
          functionName: 'create',
        },
      }));

    const spyCreateBook = jest
      .spyOn(booksService, 'createBook')
      .mockImplementation(() => Promise.resolve(bookMocks.create));

    let localResMock = _.clone(resMock);

    await booksController.create(params, localResMock);

    expect(spyFakeVendiaSlsService).toHaveBeenCalled();
    expect(spyCreateBook).toHaveBeenCalled();

    expect(localResMock.response.data).toStrictEqual(bookMocks.create);

    spyCreateBook.mockRestore();
  });

  test('mock update book', async () => {
    const { update } = bookMocks;
    const spy = jest
      .spyOn(booksService, 'updateBooks')
      .mockImplementation(() => Promise.resolve(update));

    const { _id, __v, createdAt, ...data } = update;

    const params: UpdateBookDTO = {
      ...data,
    };

    let localResMock = _.clone(resMock);
    await booksController.update(update.id, params, localResMock);

    expect(spy).toHaveBeenCalled();
    expect(localResMock.response.data).toStrictEqual(update);

    spy.mockRestore();
  });

  test('mock find book', async () => {
    const { find } = bookMocks;
    const spy = jest
      .spyOn(booksService, 'findBooks')
      .mockImplementation(() => Promise.resolve(find));

    let localResMock = _.clone(resMock);

    await booksController.find(localResMock);

    expect(spy).toHaveBeenCalled();
    expect(localResMock.response.data).toStrictEqual(find);
    spy.mockRestore();
  });

  test('mock findOne book', async () => {
    const { findOne } = bookMocks;

    const spyFakeVendiaSlsService = jest
      .spyOn(fakeVendiaSlsService, 'callGetCurrentInvoke')
      .mockImplementation(() => ({
        event: {},
        context: {
          memoryLimitInMB: 123,
        },
      }));

    const spy = jest
      .spyOn(booksService, 'findOneBookById')
      .mockImplementation(() => Promise.resolve(findOne));

    let localResMock = _.clone(resMock);
    await booksController.findOne(findOne.id, localResMock);

    expect(spyFakeVendiaSlsService).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(localResMock.response.data).toStrictEqual(findOne);
    spy.mockRestore();
  });

  test('mock deleteOne book', async () => {
    const { deleteOne } = bookMocks;
    const spy = jest
      .spyOn(booksService, 'deleteOneBookById')
      .mockImplementation(() => Promise.resolve(deleteOne));

    const params = {
      id: '123',
    };

    let localResMock = _.clone(resMock);

    await booksController.deleteOne(params.id, localResMock);

    expect(spy).toHaveBeenCalled();
    expect(localResMock.response.data).toStrictEqual(deleteOne);
    spy.mockRestore();
  });
});
