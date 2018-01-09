const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Pauses the current song.'
		});
	}

	async run(msg) {
		if (!msg.guild.voiceConnection) throw `❌ | ${msg.author}, I am not connected to any voice channels, add some songs to the queue with \`${msg.guild.configs.prefix}add <song:url>\`.`;
		else if (msg.guild.voiceConnection.dispatcher.paused) throw `❌ | ${msg.author}, the stream is already paused. Use \`${msg.guild.configs.prefix}resume\` to resume the song.`;

		msg.guild.voiceConnection.dispatcher.pause();

		return msg.send('⏸ | Paused!');
	}

};
