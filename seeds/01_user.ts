import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      id: 1,
      name: 'Test User2', 
      email: `user1@gmail.com`,
      street: 'street1',
      street_number: '1000',
      neighborhood: 'neighborhood',
      complement: 'complement',
      city: 'manaus',
      state: 'state',
      zip_code: '234234',
      status: 'active',
    },
    {
      id: 2,
      name: 'Test User2', 
      email: `user2@gmail.com`,
      street: 'street1',
      street_number: '1000',
      neighborhood: 'neighborhood',
      complement: 'complement',
      city: 'manaus',
      state: 'state',
      zip_code: '234234',
      status: 'active',
    },
  ]);
}
