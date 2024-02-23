import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/destap'),

    UserModule,

    CommonModule,

  ],
})
export class AppModule { }
