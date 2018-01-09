const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Change the current volume of the stream.',
			usage: '[volume:str]'
		});
	}

	async run(msg, [vol]) {
		if (!msg.guild.voiceConnection) throw `❌ | ${msg.author}, I am not connected to any voice channels, add some songs to the queue with \`${msg.guild.configs.prefix}add <song:url>\`.`;

		const handler = this.client.queue.get(msg.guild.id);
		if (!handler || !handler.playing) throw `❌ | ${msg.author}, I am not playing music.`;

		const { dispatcher } = msg.guild.voiceConnection;

		if (!vol) {
			return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%`);
		} else if (!isNaN(vol)) {
			vol = parseInt(vol);

			if (vol < 0 || vol > 100) return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%`);
			else if (Math.round(dispatcher.volume * 50) >= 100) return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%`);
			else if (Math.round(dispatcher.volume * 50) <= 0) return msg.send(`🔇 | Volume: ${Math.round(dispatcher.volume * 50)}%`);

			dispatcher.setVolume(vol / 50);

			return msg.send(`${vol > dispatcher.volume * 50 ? (dispatcher.volume === 2 ? '📢' : '🔊') : (dispatcher.volume === 0 ? '🔇' : '🔉')} | Volume: ${Math.round(dispatcher.volume * 50)}%`);
		}

		return undefined;
	}

};
