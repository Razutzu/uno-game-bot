module.exports = (interaction, client) => {
	const id = interaction.customId.split("_")[1];

	const game = client.games.get(id);
	if (!game) return interaction.reply({ content: "No games on this channel", ephemeral: true }).catch();

	if (game.is_user(interaction.user)) return interaction.reply({ content: "You already joined.", ephemeral: true }).catch();

	if (game.has_started()) return interaction.reply({ content: "Game has already started.", ephemeral: true }).catch();

	if (game.is_full()) return interaction.reply({ content: "Game is already full.", ephemeral: true }).catch();

	game.user_join(interaction);
};
