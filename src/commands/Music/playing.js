const { Command } = require('klasa');
const { splitText, showSeconds } = require('../../lib/Utils');
const getInfo = require('util').promisify(require('ytdl-core').getInfo);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Get information of the current song.'
		});
	}

	async run(msg) {
		const { dispatcher, queue, status } = msg.guild.music;
		if (status !== 'playing') throw `❌ | ${msg.author}, I am not playing a song. My current status is: \`${status}\`.`;

		const song = queue[0];
		const info = await getInfo(song.url).catch((err) => { throw err; });

		if (!info.author) info.author = {};

		const embed = new this.client.methods.Embed()
			.setColor(0xC51800)
			.setTitle(info.title)
			.setURL(`https://youtu.be/${info.vid}`)
			.setAuthor(info.author.name || 'Unknown', info.author.avatar || null, info.author.channel_url || null)
			.setDescription([
				`**Duration**: ${showSeconds(parseInt(info.length_seconds) * 1000)} [Time remaining: ${showSeconds((parseInt(info.length_seconds) * 1000) - dispatcher.time)}]`,
				`**Description**: ${splitText(info.description, 500)}`
			].join('\n\n'))
			.setThumbnail(info.thumbnail_url)
			.setTimestamp();

		return msg.send({ embed });
	}

};
