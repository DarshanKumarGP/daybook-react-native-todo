import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI supplied via environment variables.
 * The process exits if the connection fails, since the API is useless without a DB.
 */
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not defined in the environment.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', (error as Error).message);
    process.exit(1);
  }
};
