import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from 'src/modules/students/students.module';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { AppController } from './app.controller';
import { FirebaseStrategy } from './common/auth/firebase-auth.strategy';
import { apiLogger } from './common/middlewares/api-logger.middleware';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompaniesService } from './modules/companies/companies.service';
import { MailConfigService } from './modules/mail/mail-config.service';
import { MailModule } from './modules/mail/mail.module';
import { StudentsService } from './modules/students/students.service';
import { FirebaseAdminModule } from './providers/firebase/firebase-admin.module';
import { SharedDataAccessService } from './shared-data-access.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    MongoModule,
    StudentsModule,
    CompaniesModule,
    FirebaseStrategy,
    FirebaseAdminModule,
    MailModule,
  ],
  exports: [FirebaseStrategy, FirebaseAdminModule],
  controllers: [AppController],
  providers: [StudentsService, CompaniesService, SharedDataAccessService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //Apply global logger middleware for all routes
    consumer.apply(apiLogger).forRoutes('/');
  }
}
