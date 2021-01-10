exports.up = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.dateTime('tweet_date');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.dropColumn('tweet_date');
    })
};