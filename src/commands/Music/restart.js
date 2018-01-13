const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 6,
			runIn: ['text'],
			cooldown: 5,
			description: 'Restarts the music handler.'
		});
	}

	async run(msg) {
		await msg.guild.music.destroy();

		return msg.send('✅ | Successfully restarted the music module.');
	}

};
