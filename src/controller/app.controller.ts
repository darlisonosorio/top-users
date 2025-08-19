import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

import { FindAllUsecase } from '../usecase/find-all';
import { FindOneUsecase } from '../usecase/find-one';
import { PersistUserUsecase } from '../usecase/persist-user';
import { type UserForm } from '../model/dto/user-form';
import { DeleteUserUsecase } from '../usecase/delete-user';

@Controller()
export class AppController {
  
  constructor(
    private readonly findAllUsecase: FindAllUsecase,
    private readonly findOneUsecase: FindOneUsecase,
    private readonly persistUserUsecase: PersistUserUsecase,
    private readonly deleteUserUsecase: DeleteUserUsecase
  ) {}

  @MessagePattern({ cmd: "ping" })
  ping(_: any) {
    return of("pong users").pipe(delay(1000));
  }

  @MessagePattern({ cmd: 'find-all-users' })
  async findAll(@Payload() data: {  search?: string, page?: number; limit?: number }) {
    const { search, page, limit } = data;
    return this.findAllUsecase.execute(search, page, limit);
  }

  @MessagePattern({ cmd: 'find-user' })
  async findOne(@Payload() data: { id: number }) {
    return this.findOneUsecase.execute(data.id);
  }

  @MessagePattern({ cmd: 'create-user' })
  async create(@Payload() data: UserForm) {
    return this.persistUserUsecase.execute(null, data);
  }

  @MessagePattern({ cmd: 'update-user' })
  async update(@Payload() data: { id: number; [key: string]: any }) {
    const { id, ...updateData } = data;
    return this.persistUserUsecase.execute(id, updateData as UserForm);
  }
  
  @MessagePattern({ cmd: 'delete-user' })
  async remove(@Payload() data: { id: number }) {
    return this.deleteUserUsecase.execute(data.id);
  }

}
