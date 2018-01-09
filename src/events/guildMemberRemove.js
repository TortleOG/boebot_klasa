const { Event } = require('klasa');

module.exports = class extends Event {

	run(member) {
		const channel = member.guild.channels.get(member.guild.configs.modlog);

		if (!channel) throw `❌ | I could not find a 'modlog' channel. Was it deleted?`;

		const embed = new this.client.methods.Embed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: 'png' }))
			.setColor(0xffcc66)
			.setFooter('User Left')
			.setTimestamp();
		return channel.send({ embed });
	}

};
