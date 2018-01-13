const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Pauses the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		if (music.status === 'idle') throw `❌ | ${msg.author}, there are no streams currently playing.`;
		if (music.status === 'paused') throw `❌ | ${msg.author}, the stream is already paused.`;

		music.pause();
		return msg.send('⏸ | Paused.');
	}

};
