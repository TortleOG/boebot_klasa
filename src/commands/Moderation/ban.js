const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 3,
			botPerms: ['BAN_MEMBERS'],
			description: 'Bans a user from the guild.',
			usage: '<user:user> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (user.bot) throw `❌ | ${msg.author}, I cannot execute moderation actions against bots.`;

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member);
		else if (!member.bannable) throw `❌ | ${msg.author}, I cannot ban this user.`;
		else if (member.highestRole.position >= msg.member.highestRole.position) throw `❌ | ${msg.author}, I cannot execute moderation actions against this user.`;

		await msg.guild.ban(user, { reason });

		if (msg.guild.configs.mod.modlog) {
			new ModLog(msg.guild)
				.setType('ban')
				.setUser(user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🚨 | **${msg.author.tag}** successfully banned **${user.tag}** for *${reason}*.`);
	}

};
