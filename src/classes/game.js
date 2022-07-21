const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

class Game {
	constructor(interaction, client, max_players) {
		this.client = client;

		this.creator_id = interaction.user.id;
		this.channel = interaction.channel;

		this.started = false;

		this.max_players = max_players;
		this.users = [{ user: interaction.user, ready: false }];
		this.players = [];

		this.current_embed = new EmbedBuilder()
			.setColor(client.clr)
			.setAuthor({ name: "🎮 Let's play UNO! 🎮" })
			.setDescription("You can use the command `/help` if you don't know how I work or you don't know the rules of the game.\n\nHave fun! 😁")
			.addFields([{ name: "Users", value: this.players_to_string() }])
			.setFooter({ text: interaction.channel.name, iconURL: client.user.avatarURL() })
			.setTimestamp();

		this.current_components = [
			new ActionRowBuilder().setComponents([
				new ButtonBuilder().setCustomId(`kick_${interaction.channel.id}`).setStyle(ButtonStyle.Danger).setLabel("Kick Player").setDisabled(true),
				new ButtonBuilder().setCustomId(`ban_${interaction.channel.id}`).setStyle(ButtonStyle.Danger).setLabel("Ban Player").setDisabled(true),
				new ButtonBuilder().setCustomId(`unban_${interaction.channel.id}`).setStyle(ButtonStyle.Danger).setLabel("Unban Player").setDisabled(true),
				new ButtonBuilder().setCustomId(`lock_${interaction.channel.id}`).setStyle(ButtonStyle.Danger).setLabel("Lock").setDisabled(true),
				new ButtonBuilder().setCustomId(`switch_${interaction.channel.id}`).setStyle(ButtonStyle.Danger).setLabel("Change Host").setDisabled(true),
			]),
			new ActionRowBuilder().setComponents([
				new ButtonBuilder().setCustomId(`ready_${interaction.channel.id}`).setStyle(ButtonStyle.Success).setLabel("Ready").setDisabled(true),
				new ButtonBuilder().setCustomId(`join_${interaction.channel.id}`).setStyle(ButtonStyle.Primary).setLabel("Join"),
				new ButtonBuilder().setCustomId(`leave_${interaction.channel.id}`).setStyle(ButtonStyle.Primary).setLabel("Leave"),
			]),
		];

		this.last_msg = null;

		this.update_message(true);

		client.games.set(interaction.channel.id, this);
	}
	has_started() {
		if (this.started) return true;
		return false;
	}
	is_full() {
		if (this.users.length == this.max_players) return true;
		return false;
	}
	is_player() {}
	is_user(user) {
		if (this.users.find((u) => u.user.id == user.id)) return true;
		return false;
	}
	user_join(user) {
		this.users.push({ user: user, ready: false });
		this.current_embed.setFields([{ name: "Users", value: this.players_to_string() }]);

		if (this.users.length == 2) this.current_components[1].components[0].setDisabled(false);

		this.update_message(false);
	}
	user_leave() {}
	game_start() {}
	game_stop() {}
	game_end() {}
	is_playable() {}
	players_to_string() {
		let players = "";

		if (this.started) {
		} else {
			for (const player of this.users) {
				let rank = "👤";
				let status = "❌";

				if (player.user.id == this.creator_id) rank = "👑";
				if (player.ready) status = "✅";

				players += `> ${rank} ${player.user.username} - ${status}\n`;
			}
		}

		return players;
	}
	update_message(new_message) {
		if (new_message && this.last_msg)
			return this.last_msg
				.edit({ embeds: [this.current_embed], components: this.current_components })
				.then((msg) => (this.last_msg = msg))
				.catch();
		return this.channel
			.send({ embeds: [this.current_embed], components: this.current_components })
			.then((msg) => (this.last_msg = msg))
			.catch();
	}
}

module.exports = Game;
