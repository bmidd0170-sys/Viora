import { config } from 'dotenv';

config();

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DATABASE_URL
    }
  }
};
