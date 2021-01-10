
exports.up = function (knex) {
    return knex.schema.createTable('topics', function (t) {
        t.increments('id').primary();
        t.text('name').notNullable();
        t.boolean('deleted').notNullable().defaultTo(false);
        t.integer('requests_count').notNullable().defaultTo(0);
        t.dateTime('last_update').notNullable().defaultTo(knex.raw('now()'));;
    })
};

exports.down = function (knex) {
    return knex.schema.dropTabele('topics');
};
