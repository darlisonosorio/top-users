import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { KnexModule } from 'nest-knexjs';
import { FindAllUsecase } from './usecase/find-all';
import { FindOneUsecase } from './usecase/find-one';
import { UserRepository } from './repository/user.repository';
import { PersistUserUsecase } from './usecase/persist-user';
import { DeleteUserUsecase } from './usecase/delete-user';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        useNullAsDefault: true,
        connection: {
          host: process.env.DB_URL || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || '',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    UserRepository,
    FindAllUsecase,
    FindOneUsecase,
    PersistUserUsecase,
    DeleteUserUsecase
  ],
})
export class AppModule {}
