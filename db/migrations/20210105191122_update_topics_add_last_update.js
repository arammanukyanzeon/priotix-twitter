
exports.up = function (knex) {
    return knex.schema.alterTable('topics', function (t) {
        t.dateTime('last_update');
        t.dropColumn('talk_about');
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('topics', function (t) {
        t.dropColumn('last_update');
        t.specificType('talk_about', 'text ARRAY');
    })
};
