import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms';
import { EventsModule } from './events/events.module';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    EventsModule,
    ConfigModule.forRoot(),
    RoomsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QuestionsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
