const { Command } = require('klasa');

const ModLog = require('../../structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 3,
			botPerms: ['BAN_MEMBERS'],
			description: 'Unbans members from a guild.',
			usage: '<user:user> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await msg.guild.fetchBans();
		if (!bans.has(user.id)) throw `❌ | ${msg.author}, this user is not banned.`;

		await msg.guild.unban(user, reason);

		if (msg.guild.configs.modlog) {
			new ModLog(msg.guild)
				.setType('unban')
				.setUser(user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`✅ | **${msg.author.tag}** successfully unbanned **${user.tag}** for *${reason}*.`);
	}

};
