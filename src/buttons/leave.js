module.exports = (interaction, client) => {
	const id = interaction.customId.split("_")[1];

	const game = client.games.get(id);
	if (!game) return interaction.reply({ content: "No games on this channel" }).catch();

	if (!game.is_user(interaction.user)) return interaction.reply({ content: "You didn't join this game." }).catch();

	game.user_leave(interaction);
};
