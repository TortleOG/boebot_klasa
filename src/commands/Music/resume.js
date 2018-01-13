const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Resumes the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		if (music.status === 'idle') throw `❌ | ${msg.author}, there are no streams currently playing.`;
		if (music.status === 'playing') throw `❌ | ${msg.author}, the stream is not paused.`;

		music.pause();
		return msg.send('▶ | Resumed.');
	}

};
