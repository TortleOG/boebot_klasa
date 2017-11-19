const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Skips the current song in the queue.'
		});
	}

	async run(msg) {
		if (!msg.guild.voiceConnection) throw `❌ | ${msg.author}, I am not connected to any voice channels, add some songs to the queue with \`${msg.guild.settings.prefix}add <song:url>\`.`;

		msg.guild.voiceConnection.dispatcher.end();

		return msg.send('⏭ | Skipped!');
	}

};
