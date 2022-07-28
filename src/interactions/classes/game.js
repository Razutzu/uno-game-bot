const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

class Game {
	constructor(interaction, client, max_players) {
		this.client = client;

		this.host_id = interaction.user.id;
		this.channel = interaction.channel;

		this.started = false;

		this.max_players = max_players;
		this.users = [{ user: interaction.user, ready: false }];
		this.players = [];

		this.default_description = "You can use the command `/help` if you don't know how I work or you don't know the rules of the game.\n\nHave fun! 😁";

		this.current_embed = new EmbedBuilder()
			.setColor(client.clr)
			.setAuthor({ name: "🎮 Let's play UNO! 🎮" })
			.setDescription("You can use the command `/help` if you don't know how I work or you don't know the rules of the game.\n\nHave fun! 😁")
			.addFields([{ name: "Players (0/1)", value: this.players_to_string() }])
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

		return client.games.set(interaction.channel.id, this);
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
	is_host(user_id) {
		if (user_id == this.host_id) return true;
		return false;
	}
	user_join(interaction) {
		this.users.push({ user: interaction.user, ready: false });
		this.current_embed.setFields([{ name: `Players (${this.users.filter((u) => u.ready).length}/${this.users.length})`, value: this.players_to_string() }]);

		if (this.users.length == 2)
			for (const action_row of this.current_components) {
				for (const button of action_row.components) {
					button.setDisabled(false);
				}
			}
		else for (const user of this.users) user.ready = false;

		if (this.current_embed.data.description != this.default_description) this.current_embed.setDescription(this.default_description);

		this.current_embed.setFields([{ name: `Players (${this.users.filter((u) => u.ready).length}/${this.users.length})`, value: this.players_to_string() }]);

		return this.update_message(interaction, false, true);
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
		}

		if (this.users.length == 1)
			for (const action_row of this.current_components) {
				for (const button of action_row.components) {
					if (["Join", "Leave"].includes(button.data.label)) continue;
					button.setDisabled(true);
				}
			}

		if (this.users.length >= 1) {
			if (interaction.user.id == this.host_id) this.host_id = this.users[0].user.id;

			for (const user of this.users) user.ready = false;

			if (this.current_embed.data.description != this.default_description) this.current_embed.setDescription(this.default_description);

			this.current_embed.setFields([{ name: `Players (${this.users.filter((u) => u.ready).length}/${this.users.length})`, value: this.players_to_string() }]);
		}
		return this.update_message(interaction, false, true);
	}
	user_kick(interaction) {}
	user_ban() {}
	user_unban() {}
	user_ready(interaction) {
		this.users.find((u) => u.user.id == interaction.user.id).ready = !this.users.find((u) => u.user.id == interaction.user.id).ready;
		this.current_embed.setFields([{ name: `Players (${this.users.filter((u) => u.ready).length}/${this.users.length})`, value: this.players_to_string() }]);

		if (this.current_embed.data.description != this.default_description) this.current_embed.setDescription(this.default_description);

		if (!this.users.find((u) => !u.ready)) return this.game_load(interaction);
		else return this.update_message(interaction, false, true);
	}
	game_lock() {}
	game_change_host() {}
	game_load(interaction) {
		let seconds = 3;

		this.current_embed.setDescription(`All players are ready. Starting in **4 seconds**.`);
		this.update_message(interaction, false, true);

		const int = setInterval(() => {
			if (seconds == -1) {
				this.game_start(interaction);
				return clearInterval(int);
			}
			if (this.users.find((u) => !u.ready)) {
				this.current_embed.setDescription("You can use the command `/help` if you don't know how I work or you don't know the rules of the game.\n\nHave fun! 😁");
				return clearInterval(int);
			}
			this.current_embed.setDescription(`All players are ready. Starting in **${seconds} seconds**`);
			this.update_message(interaction, false, false);
			seconds--;
		}, 1000);
	}
	game_start(interaction) {}
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

				if (player.user.id == this.host_id) rank = "👑";
				if (player.ready) status = "✅";

				players += `> ${rank} ${player.user.toString()} - ${status}\n`;
			}
		}

		return players;
	}
	update_message(interaction, new_message, defer) {
		console.log(`${Date.now() / 1000} Updated the message`);

		if (interaction.isButton() && defer) interaction.deferUpdate();

		if (!new_message && this.last_msg) {
			if (this.last_msg.interaction)
				return this.last_msg.interaction.editReply({ embeds: [this.current_embed], components: this.current_components }).catch(() => {
					return this.channel
						.send({ embeds: [this.current_embed], components: this.current_components })
						.then((msg) => (this.last_msg = msg))
						.catch(() => {
							this.game_end();
						});
				});
			else
				return this.last_msg.edit({ embeds: [this.current_embed], components: this.current_components }).catch(() => {
					return this.channel
						.send({ embeds: [this.current_embed], components: this.current_components })
						.then((msg) => (this.last_msg = msg))
						.catch(() => {
							this.game_end();
						});
				});
		}

		return this.channel
			.send({ embeds: [this.current_embed], components: this.current_components })
			.then((msg) => (this.last_msg = msg))
			.catch(() => {
				this.game_end();
			});
	}
}

module.exports = Game;
