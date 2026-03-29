import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "user" | "admin";
export type UserStatus = "unverified" | "active" | "disabled";

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDoc = HydratedDocument<IUser, IUserMethods>;
export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
      validate: {
        validator: function (v: string) {
          return /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["unverified", "active", "disabled"],
      default: "unverified",
    },
  },
  { timestamps: true },
);

// IMPORTANT: don't pass generics to .pre(). Instead type `this` explicitly.
userSchema.pre("save", async function (this: UserDoc) {
  if (!this.isModified("password")) return;

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Optional: instance method
userSchema.methods.comparePassword = async function (
  this: UserDoc,
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
