import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async toHash(userPassword: string) {
    const salt = randomBytes(128).toString('hex');
    const hashed = (await scryptAsync(userPassword, salt, 64)) as Buffer;
    return `${hashed.toString('hex')}.${salt}`;
  }

  static async toCompare(hashedPassword: string, userPassword: string) {
    const [hashed, salt] = hashedPassword.split('.');
    const userHashed = (await scryptAsync(userPassword, salt, 64)) as Buffer;
    return hashed === userHashed.toString('hex');
  }
}
