import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UzerKhanMediaController } from './uzerkhanMedia/uzerkhanMedia.controller';
import { UzerKhanMediaService } from './uzerkhanMedia/uzerkhanMedia.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [
    AppController,
    UzerKhanMediaController,
  ],
  providers: [
    AppService,
    UzerKhanMediaService
  ],
})
export class AppModule { }
