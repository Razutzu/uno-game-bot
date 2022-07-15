const { MessageEmbed, MessageActionRow } = require("discord.js");

class Game {
	constructor(interaction, client, max_players) {
		this.client = client;

		this.creator_id = interaction.user.id;
		this.channel = interaction.channel;

		this.started = false;

		this.max_players = max_players;
		this.users = [{ user: interaction.user, ready: false }];
		this.players = [];

		this.current_embed = new MessageEmbed()
			.setColor(client.clr)
			.setAuthor({ name: "🎮 Let's play UNO! 🎮" })
			.setDescription("You can use the command `/help` if you don't know how I work or you don't know the rules of the game.\n\nHave fun! 😁")
			.addField("Users", this.players_to_string())
			.setFooter({ text: interaction.channel.name, iconURL: client.user.avatarURL() })
			.setTimestamp();

		const row = new MessageActionRow();
		const row1 = new MessageActionRow();
	}
	has_started() {
		if (this.started) return true;
		return false;
	}
	player_join() {}
	player_leave() {}
	is_playable() {}

	game_start() {}
	game_stop() {}
	game_end() {}
	is_playable() {}
	players_to_string() {
		let players = "";

		if (this.started) {
		} else {
			for (const player of this.users) {
				let rank = "🎮";
				let status = "❌";

				if (player.user.id == this.creator_id) rank = "👑";
				if (player.ready) status = "✅";

				players += `> ${rank} ${player.user.username} - ${status}`;
			}
		}

		return players;
	}
}

module.exports = Game;
