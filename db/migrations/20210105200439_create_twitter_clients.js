
exports.up = function (knex) {
    return knex.schema.createTable('twitter_client', t => {
        t.increments('id').primary();
        t.text('api_key').notNullable();
        t.text('api_key_secret').notNullable();
        t.text('acces_token').notNullable();
        t.text('acces_token_secret').notNullable();
        t.integer('requests_count').notNullable().defaultTo(0);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTabele('twitter_client');
};
