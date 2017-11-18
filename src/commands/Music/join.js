const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			botPerms: ['CONNECT'],
			description: 'Joins the voice channel of the command executor'
		});
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		if (!voiceChannel) throw `❌ | ${msg.author}, you are not in a voice channel.`;

		const permissions = voiceChannel.permissionsFor(msg.guild.me);
		if (!permissions.has('CONNECT')) throw `❌ | ${msg.author}, I do not have permission to connect to your voice channel. Check if the permission \`CONNECT\` is enabled.`;
		if (!permissions.has('SPEAK')) throw `❌ | ${msg.author}, I do not have permission to speak in your voice channel. Check if the permission \`SPEAK\` is enabled.`;

		await voiceChannel.join();

		return msg.send(`Successfully connected to the voice channel \`${voiceChannel}\``);
	}

};
