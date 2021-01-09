exports.up = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.text('twitter_id').alter();
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.bigInteger('twitter_id').alter();
    })
};