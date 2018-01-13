const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Clears the queue.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;

		if (music.voiceChannel.members.size > 6) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(2);
			if (hasPermission === false) {
				throw [
					`❌ | ${msg.author}, You can't execute this command when there are over 6 members. `,
					`You must be at least a ${msg.guild.roles.get(msg.guild.configs.mod.modRole).name}.`
				].join('');
			}
		}

		music.prune();
		return msg.send(`🗑 | Pruned ${music.queue.length}`);
	}

};
