// Packages
const { Client, PermissionLevels } = require('klasa');
const { Collection } = require('discord.js');

// Externals
const Currency = require('./Currency');

// Add custom perm levels
const permissionLevels = new PermissionLevels()
	.addLevel(0, false, () => true)
	.addLevel(2, false, (client, msg) => {
		if (!msg.guild || !msg.guild.settings.modRole) return false;
		const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
		return modRole && msg.member.roles.has(modRole.id);
	})
	.addLevel(3, false, (client, msg) => {
		if (!msg.guild || !msg.guild.settings.adminRole) return false;
		const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
		return adminRole && msg.member.roles.has(adminRole.id);
	})
	.addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);

module.exports = class BoebotClient extends Client {

	constructor(options) {
		super(options);

		this.queue = new Collection();

		this.currency = null;

		this.permissionLevels = permissionLevels;

		this.once('ready', this.setup.bind(this));
	}

	async login(token) {
		await this.validate();
		return super.login(token);
	}

	async setup() {
		this.currency = new Currency(this);
	}

	async validate() {
		if (!this.ready) return setTimeout(() => this.validate(), 1000);
		else if (!this.settings.guilds.schema.modlog) await this.settings.guilds.add('modlog', { type: 'TextChannel' });
		else if (!this.settings.guilds.schema.muterole) await this.settings.guilds.add('muterole', { type: 'Role' });
		else if (!this.settings.guilds.schema.modRole) await this.settings.guilds.add('modRole', { type: 'Role' });
		else if (!this.settings.guilds.schema.adminRole) await this.settings.guilds.add('adminRole', { type: 'Role' });
		return null;
	}

};
