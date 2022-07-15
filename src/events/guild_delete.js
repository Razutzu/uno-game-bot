module.exports = {
	name: "guildDelete",
	once: false,
	run(client, guild) {
		console.log(`➖ | I was kicked from ${guild.name}.`);
	},
};
