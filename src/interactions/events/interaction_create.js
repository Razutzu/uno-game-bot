const { InteractionType } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	run(client, interaction) {
		if (interaction.isChatInputCommand()) require(`../interactions/commands/${interaction.commandName}.js`)(interaction, client);
		else if (interaction.isButton()) require(`../interactions/buttons/${interaction.component.customId.split("_")[0]}`)(interaction, client);
		else if (interaction.isSelectMenu()) require(`../interactions/menues/${interaction.customId.split("_")[0]}`); // i was here
	},
};
