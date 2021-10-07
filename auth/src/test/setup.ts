import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;
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

afterAll(async () => {
  mongo.stop();
  mongoose.disconnect();
});

declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'root@123';

  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = res.get('Set-Cookie');
  return cookie;
};
