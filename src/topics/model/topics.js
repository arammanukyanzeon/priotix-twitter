import knex from "../../../db/db.js"

export async function addTopics(data) {
    await knex("topics")
        .insert({
            name: data.name
        })
        .returning("*");
}

export async function getTopicToScrap() {
    const [topic] = await knex("topics")
        .orderBy('last_update', 'asc')
        .limit(1);

    return topic;
}

export async function updateTopicUpdateDate(id, date) {
    await knex("topics")
        .update('last_update', date)
        .where({ id })
}
