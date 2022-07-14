module.exports = {
	name: "ready",
	once: true,
	run(client) {
		console.log(`✅ | ${client.user.tag} is ready!`);
	},
};
