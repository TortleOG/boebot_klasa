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

		this.regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;

		this.years = ['y', 'yr', 'year', 'years'];
		this.months = ['b', 'month', 'months'];
		this.weeks = ['w', 'wk', 'week', 'weeks'];
		this.days = ['d', 'day', 'days'];
		this.hours = ['h', 'hr', 'hour', 'hours'];
		this.minutes = ['m', 'min', 'minute', 'minutes'];
		this.seconds = ['s', 'sec', 'second', 'seconds'];
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
			await msg.send(`🔒 | Channel locked down for ${this.resolveDuration(time)}.`);
			this.client.lockit[msg.channel.id] = setTimeout(async () => {
				await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: null }).catch(err => { throw err; });
				msg.send('🔓 | Lockdown lifted.');
				delete this.client.lockit[msg.channel.id];
			}, new Duration(time).offset);
		}
	}

	resolveDuration(dur) {
		let str = '';

		dur.replace(this.regex, (match, p1, p2) => {
			if (this.years.some(ele => ele === p2))	str += ` ${p1} ${p1 > 1 ? 'years' : 'year'}`;
			else if (this.months.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'months' : 'month'}`;
			else if (this.weeks.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'weeks' : 'week'}`;
			else if (this.days.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'days' : 'day'}`;
			else if (this.hours.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'hours' : 'hour'}`;
			else if (this.minutes.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'minutes' : 'minute'}`;
			else if (this.seconds.some(ele => ele === p2)) 	str += ` ${p1} ${p1 > 1 ? 'seconds' : 'second'}`;
		});

		return str.slice(1);
	}

};
