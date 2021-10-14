import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'root@123';
  mongo = await MongoMemoryServer.create();
  const uri = await mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

declare global {
  var signin: () => string[];
}

afterAll(() => {
  mongoose.disconnect();
  mongo.stop();
});

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const email = 'test@test.com';

  const jwtSign = jwt.sign({ email, id }, process.env.JWT_KEY!);

  const jwtObj = {
    jwt: jwtSign,
  };

  const strJwt = JSON.stringify(jwtObj);

  const base64encoded = Buffer.from(strJwt).toString('base64');

  return [`express:sess=${base64encoded}`];
};
