import { Injectable } from "@nestjs/common";

import { ListUserResult } from "src/model/dto/list-user";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class FindAllUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(search?: string, pageParam?: number, limitParam?: number): Promise<ListUserResult> {
    const page = pageParam && pageParam > 0 ? pageParam : 1;
    const limit = limitParam && limitParam > 0 ? limitParam : 10;

    const offset = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAll(search, offset, limit);

    return {
      data: data,
      meta: {
        total: Number(total?.count ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(total?.count ?? 0) / limit),
      }
    };
  }
}