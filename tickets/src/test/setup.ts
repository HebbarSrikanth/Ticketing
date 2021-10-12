import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'root@123';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(() => {
  mongo.stop();
  mongoose.disconnect();
});

jest.mock('../natsWrapper');

declare global {
  var signin: () => string[];
}

global.signin = () => {
  //Created a body
  const email = 'test@test.com';
  //If the id is not in the proper format mongoose will throw an error
  const id = new mongoose.Types.ObjectId().toHexString();

  //Generate a JWT
  const token = jwt.sign({ email, id }, process.env.JWT_KEY!);

  //Create session object
  const jwtObj = {
    jwt: token,
  };

  //Convert the Object to a string
  const stringJWT = JSON.stringify(jwtObj);

  //Create a base64
  const base64 = Buffer.from(stringJWT).toString('base64');

  //Return the string
  return [`express:sess=${base64}`];
};
