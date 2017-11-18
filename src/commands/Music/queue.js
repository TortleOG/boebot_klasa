const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Displays the queue for the guild.'
		});
	}

	async run(msg) {
		const handler = this.client.queue.get(msg.guild.id);
		if (!handler) throw `❌ | ${msg.author}, add some songs to the queue first with \`${msg.guild.settings.prefix}add <song:url>\`.`;

		const output = [];
		for (let i = 0; i < Math.min(handler.songs.length, 15); i++) {
			output.push(`${i + 1}. ${handler.songs[i].title} - Requested by: ${handler.songs[i].requester}`);
		}

		return msg.send([
			`🗒 | __**${msg.guild.name}'s Music Queue:**__ Currently **${output.length}** songs queued ${(handler.songs.length > 15 ? '*[Only next 15 shown]*' : '')}`,
			`${'```'}${output.join('\n')}${'```'}`
		]);
	}

};
