const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permLevel: 2,
			description: 'Check a case in the modlogs.',
			usage: '<case:int|latest>',
			usageDelim: ' '
		});
	}

	async init() {
		if (!(await this.provider.hasTable('modlogs'))) await this.provider.createTable('modlogs');
	}

	async run(msg, [selected]) {
		const { modlogs } = await this.provider.get('modlogs', msg.guild.id);
		const log = modlogs[selected === 'latest' ? modlogs.length - 1 : selected - 1];

		if (!log) throw `❌ | ${msg.author}, there are no modlogs with that case number.`;

		return msg.send([
			`Type       : ${log.type}`,
			`User       : ${log.user.tag} | ${log.user.id}`,
			`Moderator  : ${log.moderator.tag} | ${log.moderator.id}`,
			`Reason     : ${log.reason}`
		], { code: 'http' });
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
