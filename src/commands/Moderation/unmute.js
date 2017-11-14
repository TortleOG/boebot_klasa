const { Command } = require('klasa');

const ModLog = require('../../structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 2,
			botPerms: ['MANAGE_GUILD'],
			description: 'Unmutes a muted user.',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const role = msg.guild.roles.get(msg.guild.settings.muterole);
		if (!role) throw `❌ | I could not find a 'muted' role. Was it deleted?`;

		if (member.user.bot) throw `❌ | ${msg.author}, I cannot execute moderation actions against bots.`;
		else if (member.highestRole.position >= msg.member.highestRole.position) throw `❌ | ${msg.author}, I cannot execute moderation actions against this user.`;
		else if (!member.roles.has(role.id)) throw `❌ | ${msg.author}, this user is not muted.`;

		await member.removeRole(role).catch(console.error);

		if (msg.guild.settings.modlog) {
			new ModLog(msg.guild)
				.setType('unmute')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🔈 | **${msg.author.tag}** successfully muted **${member.user.tag}** for *${reason}*.`);
	}

};
