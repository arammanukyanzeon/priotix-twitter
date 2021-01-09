
exports.up = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.integer('topic_id');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('tweets', function (t) {
        t.dropColumn('topic_id');
    })
};
