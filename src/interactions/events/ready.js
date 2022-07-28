const guild_model = require("../models/guild_schema");

const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "ready",
	once: true,
	async run(client) {
		client.user.setActivity("Loading");

		require("../handlers/commands_handler")(client);
		require("../handlers/cards_handler")(client);

		const guilds = client.guilds.cache;
		const to_send = [];

		const db_guilds = await guild_model.find().catch((err) => console.trace(`❌ | Database error: ${err}`));
		client.db_guilds = Array.from(db_guilds.values(), (value) => {
			return value.guild_id;
		});

		const guilds_arr = Array.from(guilds.values(), (guild) => {
			let status = "✅";

			if (!client.db_guilds.includes(guild.id)) {
				status = "❌";
				to_send.push(guild);
			}

			return { status: status, name: guild.name };
		});

		const embed = new EmbedBuilder().setColor(client.clr).setAuthor({ name: "Hi there!" }).setDescription("I still have to come up with an embed design").setTimestamp();

		let int = setInterval(async () => {
			if (to_send.length == 0) return clearInterval(int);

			const guild = to_send[0];

			embed.setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) });

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

			to_send.shift();
		}, 1500);

		console.table(guilds_arr);
		console.log(`⭕ | ${to_send.length} servers missing in the databse.`);

		client.user.setActivity("UNO!");

		console.log(`✅ | ${client.user.tag} is ready!`);
	},
};
