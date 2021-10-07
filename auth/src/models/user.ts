import mongoose, { Schema } from 'mongoose';
import { PasswordService } from '../util/passwordService';

//Create an interface that describes the properties that are required for the user
interface UserAttributes {
  email: string;
  password: string;
}

//Interface the descibes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttributes): UserDoc;
}

//We don't know what all extra details mongoose adds while saving the each document hence the output
//of the document should contain email & password along with other document details added by mongoose
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.toHash(this.get('password'));
    this.set('password', hashed);
  }

  next();
});

userSchema.statics.build = (userAttr: UserAttributes) => {
  return new User(userAttr);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
