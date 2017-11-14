const { Command } = require('klasa');

const ModLog = require('../../structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 2,
			botPerms: ['MANAGE_MESSAGES'],
			description: 'Edits a reason on a specified case.',
			usage: '<case:int|latest> <reason:str> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [selected, ...reason]) {
		reason = reason.join(' ');

		const row = await this.provider.get('modlogs', msg.guild.id);
		const log = row.modlogs[selected === 'latest' ? row.modlogs.length - 1 : selected - 1];
		if (!log) throw `❌ | ${msg.author}, there are no modlogs with that case number.`;

		const channel = await msg.guild.channels.get(msg.guild.settings.modlog);
		if (!channel) throw `❌ | I could not find a 'modlog' channel. Was it deleted?`;

		const messages = await channel.messages.fetch({ limit: 100 });
		const message = messages.find(mes => mes.author.id === this.client.user.id &&
			mes.embeds.length > 0 &&
			mes.embeds[0].type === 'rich' &&
			mes.embeds[0].footer &&
			mes.embeds[0].footer.text === `Case ${selected === 'latest' ? row.modlogs.length : selected}`);

		if (message) {
			const embed = message.embeds[0];
			const [user, mod] = embed.description.split('\n');
			embed.description = [user, mod, `**Reason**: ${reason}`].join('\n');
			await message.edit({ embed });
		} else {
			const embed = new this.client.methods.Embed()
				.setTitle(`User ${ModLog.title(log.type)}`)
				.setColor(ModLog.color(log.type))
				.setDescription([
					`**Member**: ${log.user.tag} | ${log.user.id}`,
					`**Moderator**: ${log.mod.tag}`,
					`**Reason**: ${reason}`
				].join('\n'))
				.setTimestamp()
				.setFooter(`Case ${selected === 'latest' ? row.modlogs.length : selected}`, this.client.user.displayAvatarURL({ format: 'jpg' }));
			await channel.send({ embed });
		}

		const oReason = log.reason;
		row.modlogs[selected === 'latest' ? row.modlogs.length - 1 : selected - 1].reason = reason;
		await this.provider.replace('modlogs', msg.guild.id, row);

		return msg.send(`Successfully updated the log \`#${selected}\`\n${'```http\n'}${[
			`Old reason : ${oReason || 'Not set.'}`,
			`New reason : ${reason}`
		].join('\n')}${'```'}`);
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
