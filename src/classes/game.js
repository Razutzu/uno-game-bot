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
			.addFields([{ name: "Players", value: this.players_to_string() }])
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

		interaction
			.reply({ embeds: [this.current_embed], components: this.current_components })
			.then((msg) => (this.last_msg = msg))
			.catch();

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
	user_join(interaction) {
		this.users.push({ user: interaction.user, ready: false });
		this.current_embed.setFields([{ name: "Players", value: this.players_to_string() }]);

		if (this.users.length == 2) this.current_components[1].components[0].setDisabled(false); // enabling the 'Ready' button
		else for (const user of this.users) user.ready = false;

		this.current_embed.setFields([{ name: "Players", value: this.players_to_string() }]);

		this.update_message(interaction, false);
	}
	user_leave(interaction) {
		this.users.splice(this.users.indexOf(this.users.find((u) => u.user.id == interaction.user.id)), 1);

		if (this.users.length == 0) {
			for (const action_row of this.current_components) {
				for (const button of action_row.components) {
					button.setDisabled(true);
				}
			}
			this.current_embed.setDescription("All the players left so the game was cancelled. Use the `/create` command to create another game.");
			this.current_embed.setFields([]);
		} else if (this.users.length == 1) this.current_components[1].components[0].setDisabled(true);

		if (this.users.length >= 1) {
			if (interaction.user.id == this.creator_id) this.creator_id = this.users[0].user.id;

			for (const user of this.users) user.ready = false;

			this.current_embed.setFields([{ name: "Players", value: this.players_to_string() }]);
		}
		this.update_message(interaction, false);
	}
	user_ready(interaction) {
		this.users.find((u) => u.user.id == interaction.user.id).ready = !this.users.find((u) => u.user.id == interaction.user.id).ready;
		this.current_embed.setFields([{ name: "Players", value: this.players_to_string() }]);

		if (!this.users.find((u) => !u.ready)) this.game_load();
		else this.update_message(interaction, false);
	}
	game_load() {}
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
	update_message(interaction, new_message) {
		if (interaction.isButton()) interaction.deferUpdate();

		if (!new_message && this.last_msg) {
			if (this.last_msg.interaction) return this.last_msg.interaction.editReply({ embeds: [this.current_embed], components: this.current_components }).catch();
			else return this.last_msg.edit({ embeds: [this.current_embed], components: this.current_components }).catch();
		}

		return this.channel
			.send({ embeds: [this.current_embed], components: this.current_components })
			.then((msg) => (this.last_msg = msg))
			.catch();
	}
}

module.exports = Game;
