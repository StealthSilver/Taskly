import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type MongooseGlobal = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend Node's global type to include our mongoose cache
declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

let cached: MongooseGlobal;

if (typeof globalThis.mongooseGlobal === "undefined") {
  globalThis.mongooseGlobal = { conn: null, promise: null };
}

cached = globalThis.mongooseGlobal;

if (!cached) {
  cached = globalThis.mongooseGlobal = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
