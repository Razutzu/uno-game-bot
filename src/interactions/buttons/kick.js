const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");

module.exports = (interaction, client) => {
	const id = interaction.customId.split("_")[1];

	const game = client.games.get(id);
	if (!game) return interaction.reply({ content: "No games on this channel", ephemeral: true }).catch();

	if (game.has_started()) return interaction.reply({ content: "Game has already started.", ephemeral: true }).catch();

	if (!game.is_host(interaction.user.id)) return interaction.reply({ content: "You're not the host.", ephemeral: true }).catch();

	const action_row = new ActionRowBuilder();
	const menu = new SelectMenuBuilder().setCustomId(`kick_${id}`).setPlaceholder("Select a player");

	const options = [];

	for (const user of game.users) {
		if (user.user.id == game.host_id) continue;

		options.push(new SelectMenuOptionBuilder().setLabel(user.user.tag).setDescription(`Kick ${user.user.username} from the game`).setValue(user.user.id));
	}

	menu.setOptions(options);
	action_row.setComponents([menu]);

	interaction.reply({ components: [action_row], ephemeral: true });
};
