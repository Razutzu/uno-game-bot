const { AttachmentBuilder } = require("discord.js");

module.exports = (client) => {
	const cards = require("../../cards.json");

	for (const card of cards) {
		const attachment = new AttachmentBuilder(`./cards/${card.split(" ").join("")}.png`, { name: `${card.split(" ").join("")}` });

		client.cards.set(card, attachment);
	}
};
