// Packages
const { Client, PermissionLevels } = require('klasa');
const { Collection } = require('discord.js');

// Externals
const Currency = require('./structures/Currency');

// Add custom perm levels
const permissionLevels = new PermissionLevels()
	.addLevel(0, false, () => true)
	.addLevel(2, false, (client, msg) => {
		if (!msg.guild || !msg.guild.configs.modRole) return false;
		const modRole = msg.guild.roles.get(msg.guild.configs.modRole);
		return modRole && msg.member.roles.has(modRole.id);
	})
	.addLevel(3, false, (client, msg) => {
		if (!msg.guild || !msg.guild.configs.adminRole) return false;
		const adminRole = msg.guild.roles.get(msg.guild.configs.adminRole);
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
	}

	async login(token) {
		return super.login(token);
	}

	setup() {
		this.currency = new Currency(this);
	}

	async validate() {
		const { schema } = this.gateways.guilds;
		if (!schema.hasKey('modlog')) await schema.addKey('modlog', { type: 'TextChannel' });
		else if (!schema.hasKey('muterole')) await schema.addKey('muterole', { type: 'Role' });
		else if (!schema.hasKey('modRole')) await schema.addKey('modRole', { type: 'Role' });
		else if (!schema.hasKey('adminRole')) await schema.addKey('adminRole', { type: 'Role' });
		return null;
	}

};
