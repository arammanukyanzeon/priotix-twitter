import knex from "../../../db/db.js"

class Topics {
    static tableName = "topics";
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.deleted = data.deleted;
        this.talk_about = data.talk_about;
    }

    async addTopics(data) {
        await knex("topics")
            .insert({
                name: data.name
            })
            .returning("*");
    }
    async getAllTopics() {
        return await knex("topics");
    }

    async updateTopicUpdateDate(id, date) {
        await knex("topics")
            .update('last_update', date)
            .where({ id })
    }
}
export const addTopics = Topics.prototype.addTopics;
export const getAllTopics = Topics.prototype.getAllTopics;
export const updateTopicUpdateDate = Topics.prototype.updateTopicUpdateDate;