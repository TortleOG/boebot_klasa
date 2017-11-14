const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['prune'],
			permLevel: 2,
			botPerms: ['MANAGE_MESSAGES'],
			description: 'Deletes X amount of messages from a channel, or from Y user.',
			usage: '[user:user] <amount:int{2,100}>',
			usageDelim: ' '
		});
	}

	async run(msg, [user, amount]) {
		if (!amount && !user) throw `❌ | ${msg.author}, you must specify a user and an amount, or just an amount, of messages to purge.`;

		let messages = await msg.channel.messages.fetch({ limit: amount });

		if (user) {
			const filterBy = user ? user.id : this.client.user.id;
			messages = messages.filter(mes => mes.author.id === filterBy).array().slice(0, amount);
		}

		await msg.channel.bulkDelete(messages).catch(console.error);

		return msg.send(`🗑 | Deleted ${user ? `**${amount} messages** from user **${user.tag}**` : `**${amount} messages**`}.`);
	}

};
