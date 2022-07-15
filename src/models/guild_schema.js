const { Schema, model } = require("mongoose");

const schema = new Schema({ guild_id: String });

module.exports = model("guild_models", schema);
