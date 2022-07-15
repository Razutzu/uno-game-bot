const { Client, Intents } = require("discord.js");
const { connect } = require("mongoose");

require("dotenv").config();

const pass = encodeURIComponent(process.env.PASS);

connect(`mongodb+srv://Razutzu:${pass}@unobotdb.dsflabj.mongodb.net/?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log("✅ | Database connected successfully!");
	})
	.catch((err) => {
		console.log(`❌ | Something went wrong when trying to connect to the database: ${err}`);
	});

const client = new Client({ intents: new Intents(1) });

client.games = new Map();
client.cards = new Map();

client.db_guilds = [];
client.update_commands = false;
client.clr = "#EE1C25";

client.random_element = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)];
};

require("./handlers/events_handler.js")(client);

client.login(process.env.TOKEN);
