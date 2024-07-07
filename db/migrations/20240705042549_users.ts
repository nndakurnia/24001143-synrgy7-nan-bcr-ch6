import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
    table.string('email', 50).unique().notNullable();
    table.string('password', 60).notNullable();
    table.enum('user_role', ['superadmin', 'admin', 'member']).defaultTo('member');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}

