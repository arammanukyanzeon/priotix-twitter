
exports.up = function (knex) {
    return knex.schema.createTable('tweets', function (t) {
        t.bigIncrements('id').primary();
        t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
        t.bigInteger('twitter_id');
        t.text('lang');
        t.text('text').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTabele('tweets');
};
