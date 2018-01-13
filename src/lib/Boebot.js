// Packages
const { Client, PermissionLevels } = require('klasa');

// Externals
const Currency = require('./structures/Currency');
const Music = require('./music/Music');

// Add custom perm levels
const permissionLevels = new PermissionLevels()
	.addLevel(0, false, () => true)
	.addLevel(2, false, (client, msg) => {
		if (!msg.guild || !msg.guild.configs.mod.modRole) return false;
		const modRole = msg.guild.roles.get(msg.guild.configs.mod.modRole);
		return modRole && msg.member.roles.has(modRole.id);
	})
	.addLevel(3, false, (client, msg) => {
		if (!msg.guild || !msg.guild.configs.mod.adminRole) return false;
		const adminRole = msg.guild.roles.get(msg.guild.configs.mod.adminRole);
		return adminRole && msg.member.roles.has(adminRole.id);
	})
	.addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);

module.exports = class BoebotClient extends Client {

	constructor(options) {
		super(options);

		this.currency = null;

		this.permissionLevels = permissionLevels;

		this.queue = new Music(this);
	}

	async login(token) {
		return super.login(token);
	}

	setup() {
		this.currency = new Currency(this);
	}

	async validate() {
		const { schema } = this.gateways.guilds;

		// Validate Moderation Folder
		if (!schema.hasKey('mod')) {
			await schema.addFolder('mod', {
				modlog: { type: 'TextChannel' },
				muterole: { type: 'Role' },
				modRole: { type: 'Role' },
				adminRole: { type: 'Role' }
			});
		}

		// Validate Music Folder
		if (!schema.hasKey('music')) {
			await schema.addFolder('music', { musicTC: { type: 'TextChannel' } });
		}

		return null;
	}

};
