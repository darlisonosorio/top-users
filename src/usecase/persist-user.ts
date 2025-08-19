import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices';
import { UserForm } from "src/model/dto/user-form";
import { UserRepository } from "src/repository/user.repository";
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PersistUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number|null, data?: UserForm): Promise<number> {
    await this._validateData(data);

    if (id) {
      const existingUser = await this.userRepository.findOne(id);
      if (!existingUser) {
        throw new RpcException({ statusCode: 404, message: `User with id ${id} not found` });
      }
      data!.created_at = existingUser.created_at;
      data!.is_deleted = existingUser.is_deleted;
    } else {
      data!.created_at = new Date();
    }
    
    const user = await this.userRepository.persist(id, data!);

    return user;
  }

  async _validateData(data?: UserForm): Promise<void> {
    if (!data) {
      throw new RpcException({ statusCode: 400, message: 'Invalid user data.' });
    }

    try {
      await validateOrReject(plainToInstance(UserForm, data));
    } catch (errors) {
      throw new RpcException({
        statusCode: 400, 
        message: errors
        .map((e) => Object.values(e.constraints || {}).join(', '))
        .join('; ')
      });
    }
  }

}
