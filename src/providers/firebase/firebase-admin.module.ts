import { Global, Logger, Module } from '@nestjs/common';
import * as chalk from 'chalk';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../firebase-admin-credentials.json';

//creates an asyncronous an resuable provider for the firebase admin
//initializeApp should only be called once
@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: async (): Promise<any> => {
        try {
          //initialize firebase admin with credentials file
          admin.initializeApp({
            credential: admin.credential.cert(
              serviceAccount as admin.ServiceAccount,
            ),
          });
          const logger = new Logger();
          logger.log(chalk.blue('initialized and configured'), 'FirebaseAdmin');

          return admin;
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseAdminModule {}
