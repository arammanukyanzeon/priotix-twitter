
exports.up = function (knex) {
    return knex.schema.createTable('topic_finish_dates', function (t) {
        t.increments('id').primary();
        t.integer('topic_id').notNullable();
        t.dateTime('finish_date').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTabele('topic_finish_dates');
};
