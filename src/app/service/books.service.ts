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
        ...params,
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

  public async deleteOneBookById(id: string) {
    let checkIfNum = id as unknown as number;
    if (!isNaN(checkIfNum))
      return (await this.books.deleteOne({ id: Number(checkIfNum) })) as any;
    else if (typeof id === 'string')
      return (await this.books.deleteOne({ _id: id })) as any;
  }
}

export default BooksService;
