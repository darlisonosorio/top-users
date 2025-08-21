import { BadRequestException, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";
import { User } from "src/model/dto/user";
import { UserForm } from "src/model/dto/user-form";

@Injectable()
export class UserRepository {

  constructor(@InjectConnection() private readonly knex: Knex) {}

  findAll(search: string|undefined, offset: number, limit: number) {
    const query = this.knex('users')
      .select('id', 'name', 'email', 'status')
      .where({ is_deleted: false });

    if (search) {
      query.andWhere((qb) => {
        qb.whereILike('name', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }

    const countQuery = this.knex('users')
      .count<{ count: string }>({ count: '*' })
      .where({ is_deleted: false });

    if (search) {
      countQuery.andWhere((qb) => {
        qb.whereILike('name', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }

    return Promise.all([
      query.limit(limit).offset(offset),
      countQuery.first(),
    ]);
  }

  findOne(id: number): Promise<User> {
    return this.knex('users')
      .select(
        'id', 
        'name', 
        'email', 
        'street', 
        'street_number', 
        'neighborhood', 
        'complement', 
        'city', 
        'state', 
        'zip_code',
        'status', 
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at'
      )
      .where({ id })
      .first();
  }

  async persist(id: number|null, data: UserForm): Promise<number> {
    const userData = {
      ...data,
      updated_at: new Date(),
    };

    try {
        const result = await (id 
          ? this.knex('users')
            .update(userData)
            .where({ id })
            .returning('id')
            .then((result) => result[0])
          : this.knex('users')
            .insert(userData)
            .returning('id')
            .then((result) => result[0]));
        return result;
    } catch (error) {
      throw new RpcException({
          statusCode: 400,
          message: 'Email already exists or invalid data.',
      });
      throw new BadRequestException(error.message);
    }
  }

  delete(id: number): Promise<number> {
    return this.knex('users')
      .update({ is_deleted: true, deleted_at: new Date() })
      .where({ id });
  }

}