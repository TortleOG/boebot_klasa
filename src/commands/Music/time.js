const { Command } = require('klasa');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Displays the time remaining in the current song.'
		});
	}

	async run(msg) {
		if (!msg.guild.voiceConnection) throw `❌ | ${msg.author}, I am not connected to any voice channels, add some songs to the queue with \`${msg.guild.configs.prefix}add <song:url>\`.`;

		const handler = this.client.queue.get(msg.guild.id);
		if (!handler || !handler.playing) throw `❌ | ${msg.author}, I am not playing music.`;

		return msg.send(`🕰 | Time remaining: ${moment.duration((handler.songs[0].seconds * 1000) - msg.guild.voiceConnection.dispatcher.time).format('h:mm:ss', { trim: false })}`);
	}

};
