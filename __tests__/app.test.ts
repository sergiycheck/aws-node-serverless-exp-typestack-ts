import * as bookMocks from '../mocks/books.mock';
import BooksController from '../app/controllers/books';
import { Books } from '../app/model';
import { Result } from '../app/utils/message';

const booksController = new BooksController(Books);

describe('mock service methods, test methods of controller', () => {
  test('mock create book', async () => {
    const spyCreateBook = jest
      .spyOn(booksController, 'createBook')
      .mockImplementation(() => Promise.resolve(bookMocks.create));

    const { _id, __v, createdAt, ...data } = bookMocks.create;
    const event: any = {
      body: JSON.stringify({
        ...data,
      }),
    };
    const context: any = { functionName: 'create' };
    const res = await booksController.create(event, context);

    expect(spyCreateBook).toHaveBeenCalled();
    const body = JSON.parse(res.body) as Result;
    expect(body.data).toStrictEqual(bookMocks.create);
    spyCreateBook.mockRestore();
  });

  test('mock update book', async () => {
    const { update } = bookMocks;
    const spy = jest
      .spyOn(booksController, 'updateBooks')
      .mockImplementation(() => Promise.resolve(update));

    const { _id, __v, createdAt, ...data } = update;
    const event: any = {
      body: JSON.stringify({
        ...data,
      }),
      pathParameters: {
        id: update.id,
      },
    };

    const res = await booksController.update(event);

    expect(spy).toHaveBeenCalled();
    const body = JSON.parse(res.body) as Result;
    expect(body.data).toStrictEqual(update);
    spy.mockRestore();
  });

  test('mock find book', async () => {
    const { find } = bookMocks;
    const spy = jest
      .spyOn(booksController, 'findBooks')
      .mockImplementation(() => Promise.resolve(find));

    const res = await booksController.find();

    expect(spy).toHaveBeenCalled();
    const body = JSON.parse(res.body) as Result;
    expect(body.data).toStrictEqual(find);
    spy.mockRestore();
  });

  test('mock findOne book', async () => {
    const { findOne } = bookMocks;
    const spy = jest
      .spyOn(booksController, 'findOneBookById')
      .mockImplementation(() => Promise.resolve(findOne));

    const event: any = {
      pathParameters: {
        id: findOne.id,
      },
    };
    const context: any = { memoryLimitInMB: 1024 };
    const res = await booksController.findOne(event, context);

    expect(spy).toHaveBeenCalled();
    const body = JSON.parse(res.body) as Result;
    expect(body.data).toStrictEqual(findOne);
    spy.mockRestore();
  });

  test('mock deleteOne book', async () => {
    const { deleteOne } = bookMocks;
    const spy = jest
      .spyOn(booksController, 'deleteOneBookById')
      .mockImplementation(() => Promise.resolve(deleteOne));

    const event: any = {
      pathParameters: {
        id: 123,
      },
    };
    const res = await booksController.deleteOne(event);

    expect(spy).toHaveBeenCalled();
    const body = JSON.parse(res.body) as Result;
    expect(body.data).toStrictEqual(deleteOne);
    spy.mockRestore();
  });
});
