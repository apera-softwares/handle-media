import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadController } from './fileUpload/fileUpload.controller';
import { FileUploadService } from './fileUpload/fileUpload.service';
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
    FileUploadController,
  ],
  providers: [
    AppService,
    FileUploadService
  ],
})
export class AppModule { }
