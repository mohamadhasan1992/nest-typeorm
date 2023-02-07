import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_PIPE } from '@nestjs/core';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Reports } from './reports/reports.entity';
const cookieSession = require('cookie-session');


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return{
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Reports],
          synchronize: true
        }
      }
    }),
    UsersModule, 
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // add global pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    },
  ],
})
export class AppModule {
  // add global midelware
  constructor(private configService: ConfigService){}
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get<string>('COOKIE_KEY')]
        })
      )
      .forRoutes('*');
    }
}
