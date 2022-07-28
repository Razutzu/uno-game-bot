class Player {
	constructor(interaction, client, channel) {
		this.user = interaction.user;
		this.game_id = channel.id;

		this.client = client;
	}
	ready() {}
}

module.exports = Player;
