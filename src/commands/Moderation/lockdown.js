const { Command } = require('klasa');
const { Duration } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['lock'],
			permLevel: 2,
			botPerms: ['MANAGE_CHANNELS'],
			description: 'Locks a text channel for a specified time.',
			usage: '<time:str>'
		});
	}

	async run(msg, [time]) {
		if (!this.client.lockit) this.client.lockit = [];

		const validUnlocks = ['release', 'unlock'];

		if (!time) throw `❌ | ${msg.author}, you must specify a duration for the lockdown.`;

		if (validUnlocks.includes(time)) {
			await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: null }).catch(err => { throw err; });
			msg.send('🔓 | Lockdown lifted.');
			clearTimeout(this.client.lockit[msg.channel.id]);
			delete this.client.lockit[msg.channel.id];
		} else {
			await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: false }).catch(err => { throw err; });
			await msg.send(`🔒 | Channel locked down for \`${time}\`.`);
			this.client.lockit[msg.channel.id] = setTimeout(async () => {
				await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: null }).catch(err => { throw err; });
				msg.send('🔓 | Lockdown lifted.');
				delete this.client.lockit[msg.channel.id];
			}, new Duration(time).offset);
		}
	}

};
