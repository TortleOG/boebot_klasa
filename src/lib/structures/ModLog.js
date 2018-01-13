module.exports = class ModLog {

	constructor(guild) {
		Object.defineProperty(this, 'guild', { value: guild });

		Object.defineProperty(this, 'client', { value: guild.client });

		this.type = null;
		this.user = null;
		this.moderator = null;
		this.reason = null;
		this.case = null;
	}

	setType(type) {
		this.type = type;
		return this;
	}

	setUser(user) {
		this.user = {
			id: user.id,
			tag: user.tag
		};
		return this;
	}

	setMod(mod) {
		this.moderator = {
			id: mod.id,
			tag: mod.tag
		};
		return this;
	}

	setReason(reason) {
		this.reason = reason;
		return this;
	}

	async send() {
		const modlog = await this.guild.channels.get(this.guild.configs.mod.modlog);
		if (!modlog) throw 'The modlog channel does not exist. Where did it go?';
		this.case = await this.getCase();
		return modlog.send({ embed: this.embed });
	}

	async getCase() {
		const row = await this.provider.get('modlogs', this.guild.id);
		if (!row) return this.provider.create('modlogs', this.guild.id, { modlogs: [this.pack] }).then(() => 1);
		row.modlogs.push(this.pack);
		await this.provider.replace('modlogs', this.guild.id, row);
		return row.modlogs.length;
	}

	get pack() {
		return {
			type: this.type,
			user: this.user,
			moderator: this.moderator,
			reason: this.reason,
			case: this.case
		};
	}

	get embed() {
		const embed = new this.client.methods.Embed()
			.setColor(ModLog.color(this.type))
			.setTitle(`User ${ModLog.title(this.type)}`)
			.setDescription([
				`**Member**: ${this.user.tag} | ${this.user.id}`,
				`**Moderator**: ${this.moderator.tag} | ${this.moderator.id}`,
				`**Reason**: ${this.reason || `No reason specified. Write '${this.guild.configs.prefix}reason <case#>' to claim this log.`}`
			])
			.setFooter(`Case ${this.case}`, this.client.user.displayAvatarURL({ format: 'jpg' }))
			.setTimestamp();
		return embed;
	}

	static color(type) {
		switch (type) {
			case 'ban': return 0xcc0000;
			case 'unban': return 0x2d862d;
			case 'kick': return 0xe65c00;
			case 'mute':
			case 'unmute': return 0x993366;
			case 'warn': return 0xf2f20d;
			default: return 0xffffff;
		}
	}

	static title(type) {
		switch (type) {
			case 'ban': return 'Banned';
			case 'unban': return 'Unbanned';
			case 'mute': return 'Muted';
			case 'unmute': return 'Unmuted';
			case 'kick': return 'Kicked';
			case 'warn': return 'Warned';
			default: return '{{Unknown Action}}';
		}
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
