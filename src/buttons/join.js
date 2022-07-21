module.exports = (interaction, client) => {
	const id = interaction.customId.split("_")[1];

	const game = client.games.get(id);
	if (!game) return interaction.reply({ content: "No games on this channel" }).catch();

	if (game.is_user(interaction.user)) return interaction.reply({ content: "You already joined." }).catch();

	if (game.has_started()) return interaction.reply({ content: "Game has already started." }).catch();

	if (game.is_full()) return interaction.reply({ content: "Game is already full." }).catch();

	game.user_join(interaction);
};
