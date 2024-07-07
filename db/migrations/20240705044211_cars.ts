import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cars', (table: Knex.TableBuilder) => {
    table.increments('id').primary();
    table.string('plate', 20).unique().notNullable();
    table.string('name', 50).notNullable();
    table.string('image').notNullable();
    table.integer('rent_cost').unsigned().notNullable(); // unsigned: memastikan nilai tidak negatif
    table.integer('capacity').unsigned().notNullable();
    table.text('description');
    table.string('transmission');
    table.string('type').notNullable();
    table.integer('year').unsigned();
    table.timestamp('available_at').defaultTo(knex.fn.now()).notNullable();
    table.boolean('is_available').defaultTo('true').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();;
    table.integer('updated_by').unsigned().notNullable();
    table.timestamp('deleted_at').nullable();
    table.integer('deleted_by').unsigned().nullable();

    // foreign key constraints
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('updated_by').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('deleted_by').references('id').inTable('users').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cars');
}

