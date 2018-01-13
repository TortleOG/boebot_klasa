const { Command } = require('klasa');
const { showSeconds } = require('../../lib/Utils');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Check how much time is left for the current song to end.'
		});
	}

	async run(msg) {
		const { status, dispatcher, queue } = msg.guild.music;

		if (status !== 'playing') throw `❌ | ${msg.author}, I am not playing a song. My current status is: \`${status}\`.`;
		return msg.send(`🕰 | Time remaining: ${showSeconds((queue[0].seconds * 1000) - dispatcher.time)}`);
	}

};
