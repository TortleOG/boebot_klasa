const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Joins the command executor\'s voice channel.'
		});
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		if (!voiceChannel) throw `❌ | ${msg.author}, you are not connected to a voice channel. Please join one and try again.`;
		this.resolvePermissions(msg, voiceChannel);

		const { music } = msg.guild;
		await music.join(voiceChannel);

		return msg.send(`✅ | Successfully joined the voice channel ${voiceChannel}.`);
	}

	resolvePermissions(msg, voiceChannel) {
		const permissions = voiceChannel.permissionsFor(msg.guild.me);

		if (permissions.has('CONNECT') === false) throw `❌ | ${msg.author}, I do not have permission to connect to your voice channel. Check if the permission \`CONNECT\` is enabled.`;
		else if (permissions.has('SPEAK') === false) throw `❌ | ${msg.author}, I do not have permission to speak in your voice channel. Check if the permission \`SPEAK\` is enabled.`;
	}

};
