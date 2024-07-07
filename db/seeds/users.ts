import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Superadmin',
      email: 'superadmin@gmail.com',
      password: 'inipwadmin123',
      user_role: 'superadmin',
    },
  ]);
};
