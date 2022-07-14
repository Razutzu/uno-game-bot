const { readdirSync } = require("fs");

module.exports = (client) => {
	const events = readdirSync("./src/events");
	for (const file of events) {
		const event = require(`../events/${file}`);

		if (event.once) {
			client.once(event.name, (...args) => event.run(client, ...args));
		} else {
			client.on(event.name, (...args) => event.run(client, ...args));
		}
	}
};
