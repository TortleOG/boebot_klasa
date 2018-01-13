const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Remove a song from the queue.',
			usage: '<number:int>'
		});

		this.requireMusic = true;
	}

	async run(msg, [number]) {
		if (number <= 0) throw `❌ | ${msg.author}, invalid index.`;
		number--;

		const { music } = msg.guild;
		if (music.queue.length < number) throw `❌ | ${msg.author}, you went out of range, the queue has ${music.queue.length}.`;

		const song = music.queue[number];
		if (song.requester.id !== msg.author.id) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(2);
			if (hasPermission === false) throw `❌ | ${msg.author}, you can't execute this command with the force flag. You must be at least a ${msg.guild.roles.get(msg.guild.configs.mod.modRole).name}.`;
		}

		music.queue.splice(number, 1);

		return msg.send(`🗑 | Removed the song **${song.title}** requested by **${song.requester}**.`);
	}

};
