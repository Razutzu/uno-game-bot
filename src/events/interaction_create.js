const { InteractionType } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	run(client, interaction) {
		if (interaction.type === InteractionType.ApplicationCommand) require(`../commands/${interaction.commandName}.js`)(interaction, client);
		else if (interaction.isButton()) require(`../buttons/${interaction.component.customId.split("_")[0]}`)(interaction, client);
	},
};
