import { BookModelName } from './../model/books';
import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';
import { CustomLog } from '../logger/customLogger';
import { Book } from '../model';
import { CreateBookDTO, UpdateBookDTO } from '../model/dto/dtos.dto';
import { ResponseBook } from '../model/vo/responseVo';

@Service()
class BooksService {
  private books: Model<Book>;

  constructor(@Inject(BookModelName) books: Model<Book>) {
    this.books = books;
  }

  public async createBook(params: CreateBookDTO): Promise<object> {
    try {
      const result = await this.books.create({
        name: params.name,
        id: params.id,
      });

      return result;
    } catch (err) {
      CustomLog.error(err);

      throw err;
    }
  }

  public async updateBooks(id: number, data: UpdateBookDTO) {
    return (await this.books
      .findOneAndUpdate({ id }, { ...data }, { runValidators: true, new: true })
      .lean()) as unknown as ResponseBook;
  }

  public async findBooks() {
    return (await this.books.find({})) as unknown as ResponseBook[];
  }

  public async findOneBookById(id: number) {
    return (await this.books.findOne({ id })) as unknown as ResponseBook;
  }

  public async deleteOneBookById(id: number) {
    return (await this.books.deleteOne({ id })) as any;
  }
}

export default BooksService;
