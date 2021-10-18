import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;
process.env.STRIPE_SECRET =
  'sk_test_51JleIoSE2LGKCeXgt4Wqg110fb0I17sygoVerKoH6HybeyJU4djFjNzbXm7RrPDEe1flJkCSjKL9IYMYuxpv9WF300zM86Tg9I';
beforeAll(async () => {
  process.env.JWT_KEY = 'root@123';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(() => {
  mongoose.disconnect();
  mongo.stop();
});

jest.mock('../NatsWrapper.ts');

declare global {
  var signin: (userId?: string) => string[];
}

global.signin = (userId) => {
  const id = userId || new mongoose.Types.ObjectId().toHexString();
  const email = 'test@test.com';

  const token = jwt.sign({ id, email }, process.env.JWT_KEY!);

  const jwtObj = {
    jwt: token,
  };

  const jwtStr = JSON.stringify(jwtObj);

  const base64 = Buffer.from(jwtStr).toString('base64');

  return [`express:sess=${base64}`];
};
