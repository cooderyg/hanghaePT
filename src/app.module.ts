import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { PostsModule } from './apis/posts/posts.module';
import { StudiesModule } from './apis/studies/studies.module';
import { ChatgptsModule } from './apis/chatgpts/chatgpts.module';
import { QuestionsModule } from './apis/questions/questions.module';
import { CommentsModule } from './apis/comments/comments.module';
import { QuestionDetailsModule } from './apis/questionDetails/question-details.module';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    CommentsModule,
    QuestionsModule,
    QuestionDetailsModule,
    ChatgptsModule,
    UsersModule,
    StudiesModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true, // 개발환경에서만 사용
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
      timezone: 'UTC',
    }),
    QuestionDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
