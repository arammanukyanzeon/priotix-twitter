
exports.up = function (knex) {
    return knex.schema.alterTable('twitter_client', function (t) {
        t.integer('limit');
        t.dateTime('expire_date');
        t.dateTime('blocked_until_date');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('twitter_client', function (t) {
        t.dropColumn('limit');
        t.dropColumn('expire_date');
        t.dropColumn('blocked_until_date');
    })
};