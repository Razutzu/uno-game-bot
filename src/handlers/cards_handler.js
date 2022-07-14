const { MessageAttachment } = require("discord.js");

module.exports = (client) => {
	const cards = require("../../cards.json");

	for (const card of cards) {
		const attachment = new MessageAttachment(`./cards/${card.split(" ").join("")}.png`);

		attachment.name = `${card.split(" ").join("")}`;

		client.cards.set(card, attachment);
	}
};
