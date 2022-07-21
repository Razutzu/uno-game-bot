const Game = require("../classes/game");

module.exports = (interaction, client) => {
	// De terminat
	let max_players = interaction.options.getInteger("max_players");

	if (!max_players) max_players = 10;

	const game = new Game(interaction, client, max_players);
};
