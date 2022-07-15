const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = (client) => {
	if (!client.update_commands) return;

	const create = new SlashCommandBuilder()
		.setName("create")
		.setDescription("Create an UNO game.")
		.addIntegerOption((option) => option.setName("max_players").setDescription("The maximum amount of players. You can change this later.").setMaxValue(10).setMinValue(2));

	const help = new SlashCommandBuilder().setName("help").setDescription("See almost everything you can know about me.");

	client.application.commands.set([create, help]);
};
