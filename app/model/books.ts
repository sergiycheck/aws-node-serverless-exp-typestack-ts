import mongoose from 'mongoose';

export type Book = {
  name: string;
  id: number;
  description: string;
  createdAt: Date;
};

const booksSchema = new mongoose.Schema<Book>({
  name: String,
  id: { type: Number, index: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

// Note: OverwriteModelError: Cannot overwrite `Books` model once compiled. error
//
export const BookModelName = 'Book';

function getBooks() {
  const fromMongooseModels = mongoose.models[BookModelName];
  if (fromMongooseModels) return fromMongooseModels;
  const mongooseModel = mongoose.model(BookModelName, booksSchema);
  return mongooseModel;
}

export const Books = getBooks();
