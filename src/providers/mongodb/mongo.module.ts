import { Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
///Module for async initialisation of the mongodb connection
///Can be injected by the provider name
@Module({
  providers: [
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async (): Promise<Db> => {
        const logger = new Logger('MONGODB');
        try {
          //try to connect the client with a connection string ( from .env file)
          const connectionUrl = process.env.MONGO_CONNECTION_URL;
          logger.log(`Start connecting on ${connectionUrl}`);
          const client = await MongoClient.connect(connectionUrl, {
            useUnifiedTopology: true,
          });
          //select a database with the given name ( if not already existing, creates a new one)
          const db: Db = client.db('projectstore');

          await db
            .collection('init_collection')
            .createIndex({ id: 1 }, { unique: true, sparse: true });
          return db;
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['MONGO_CONNECTION'],
})
export class MongoModule {}
