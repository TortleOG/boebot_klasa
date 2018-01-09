const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Resumes the stream after being paused.'
		});
	}

	async run(msg) {
		if (!msg.guild.voiceConnection) throw `❌ | ${msg.author}, I am not connected to any voice channels, add some songs to the queue with \`${msg.guild.configs.prefix}add <song:url>\`.`;
		else if (!msg.guild.voiceConnection.dispatcher.paused) throw `❌ | ${msg.author}, the stream is not paused.`;

		msg.guild.voiceConnection.dispatcher.resume();

		return msg.send('▶ | Resumed!');
	}

};
