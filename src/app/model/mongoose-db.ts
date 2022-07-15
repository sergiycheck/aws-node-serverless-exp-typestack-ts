import mongoose from 'mongoose';
import { CustomLog } from '../logger/customLogger';

export default async function connectToMongoDb() {
  CustomLog.log('process.env.DB_URL', process.env.DB_URL);
  CustomLog.log('process.env.DB_NAME', process.env.DB_NAME);
  CustomLog.log('process.env.NODE_ENV', process.env.NODE_ENV);
  await mongoose.connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
  });
}
