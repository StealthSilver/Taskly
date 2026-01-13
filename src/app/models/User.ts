import mongoose, { Schema, models, model } from "mongoose";

export interface IUser extends mongoose.Document {
  name?: string;
  email: string;
  password?: string;
  image?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", UserSchema);
