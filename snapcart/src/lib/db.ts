import mongoose from "mongoose";

const mongodbUrl =
    process.env.MONGODB_URL || (process.env.NODE_ENV === "development" ? "mongodb://127.0.0.1:27017/snapcart" : undefined);

if (!mongodbUrl) {
    console.error(
        "MONGODB_URL is not set. In production you must set MONGODB_URL to your MongoDB Atlas connection string."
    );
    throw new Error("Missing MONGODB_URL");
}

type Cached = { conn: any | null; promise: Promise<any> | null };

declare global {
    // eslint-disable-next-line no-var
    var mongoose: Cached | undefined;
}

let cached = global.mongoose;
if (!cached) {
    global.mongoose = { conn: null, promise: null };
    cached = global.mongoose;
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(mongodbUrl)
            .then((m) => m.connection)
            .catch((err) => {
                console.error("MongoDB connection error:", err);
                throw err;
            });
    }

    const conn = await cached.promise;
    cached.conn = conn;
    return conn;
};

export default connectDb;