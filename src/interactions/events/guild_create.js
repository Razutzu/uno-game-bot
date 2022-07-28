const guild_model = require("../models/guild_schema");

const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "guildCreate",
	once: false,
	async run(client, guild) {
		console.log(`➕ | I joined ${guild.name}.`);

		if (client.db_guilds.includes(guild.id)) return;

		const embed = new EmbedBuilder()
			.setColor(client.clr)
			.setAuthor({ name: "Hi there!" })
			.setDescription("I still have to come up with an embed design")
			.setTimestamp()
			.setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) });

		const channels = Array.from(guild.channels.cache.values());

		let sent = false;

		for (const channel of channels) {
			if (sent) break;
			if (channel.type != "GUILD_TEXT") continue;
			if (!channel.viewable) continue;
			if (!channel.permissionsFor(guild.me).has("SEND_MESSAGES") || !channel.permissionsFor(guild.me).has("EMBED_LINKS")) continue;

			sent = true;

			channel.send({ embeds: [embed] }).catch(() => (sent = false));
		}

		const guild_data = await guild_model.create({ guild_id: guild.id }).catch((err) => console.trace(`❌ | Database error: ${err}`));
		client.db_guilds.push(guild.id);
	},
};
