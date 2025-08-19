import { Injectable } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices';
import { User } from "src/model/dto/user";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<number> {
      const user = await this.userRepository.findOne(id);
      
      if (!user) {
        throw new RpcException({
          statusCode: 404,
          message: `User with id ${id} not found`,
        });
      }

      if (user.is_deleted) {
        throw new RpcException({
          statusCode: 400,
          message: `User with id ${id} is already deleted`,
        });
      }

      return this.userRepository.delete(id);
    }
  }
