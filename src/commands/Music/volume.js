const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Change the current volume of the stream.',
			usage: '[volume:int]'
		});

		this.requireMusic = true;
	}

	async run(msg, [vol]) {
		const { dispatcher, status } = msg.guild.music;
		if (status !== 'playing') throw `❌ | ${msg.author}, I am not playing a song. My current status is: \`${status}\`.`;

		if (!vol) return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%.`);

		if (vol < 0 || vol > 100) return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%.`);

		const dispatchVolume = Math.round(dispatcher.volume * 50);
		if (dispatchVolume >= 100) return msg.send(`📢 | Volume: ${Math.round(dispatcher.volume * 50)}%.`);
		else if (dispatchVolume <= 0) return msg.send(`🔇 | Volume: ${Math.round(dispatcher.volume * 50)}%.`);

		dispatcher.setVolume(vol / 50);

		return msg.send(`${vol > dispatcher.volume * 50 ? (dispatcher.volume === 2 ? '📢' : '🔊') : (dispatcher.volume === 0 ? '🔇' : '🔉')} | Volume: ${Math.round(dispatcher.volume * 50)}%.`);
	}

};
