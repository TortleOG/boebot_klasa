const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 2,
			botPerms: ['MANAGE_GUILD', 'MANAGE_ROLES'],
			description: 'Mute a user from speaking in text channels.',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const role = msg.guild.roles.get(msg.guild.configs.muterole);
		if (!role) throw `❌ | I could not find a 'muted' role. Was it deleted?`;

		if (member.user.bot) throw `❌ | ${msg.author}, I cannot execute moderation actions against bots.`;
		else if (member.highestRole.position >= msg.member.highestRole.position) throw `❌ | ${msg.author}, I cannot execute moderation actions against this user.`;
		else if (member.roles.has(role.id)) throw `❌ | ${msg.author}, this user is already muted.`;

		await member.addRole(role).catch(err => { throw err; });

		if (msg.guild.configs.modlog) {
			new ModLog(msg.guild)
				.setType('mute')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🔇 | **${msg.author.tag}** successfully muted **${member.user.tag}** for *${reason}*.`);
	}

};
