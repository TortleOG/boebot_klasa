const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 3,
			botPerms: ['KICK_MEMBERS'],
			description: 'Kicks members from the guild.',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (member.user.bot) throw `❌ | ${msg.author}, I cannot execute moderation actions against bots.`;
		else if (!member.kickable) throw `❌ | ${msg.author}, I cannot kick this user.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, I cannot execute moderation actions against this user.`;

		await member.kick(reason);

		if (msg.guild.configs.mod.modlog) {
			new ModLog(msg.guild)
				.setType('kick')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🛑 | **${msg.author.tag}** successfully kicked **${member.user.tag}** for *${reason}*.`);
	}

};
