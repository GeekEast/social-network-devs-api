import { connect } from 'mongoose';
import config from 'config';

// get the uri with username and password
const username = config.get('Server.USER') as string;
const access_key = config.get('Server.PASSWORD') as string;
const uri = (<string>config.get('Server.URI'))
  .replace(/USER/, username)
  .replace(/PASSWORD/, access_key);

// mongodb connector as a function
const connectDB = async () => {
  try {
    // useCreateIndex for indexing - performance of query
    await connect(
      uri,
      { useNewUrlParser: true, useCreateIndex: true }
    );
    console.log('MongoDB connected...');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDB };
