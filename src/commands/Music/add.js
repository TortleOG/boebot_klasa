const { Command } = require('klasa');
const yt = require('ytdl-core');

const getInfo = require('util').promisify(yt.getInfo);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: [],
			botPerms: ['USE_VAD'],
			description: 'Adds a song to the queue.',
			usage: '<song:str>'
		});

		this.YouTubeRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;

		this.DEFAULT = {
			playing: false,
			songs: []
		};
	}

	async run(msg, [song]) {
		const id = this.YouTubeRegExp.exec(song);
		if (!id) throw `❌ | ${msg.author}, that is not a valid Youtube URL.`;

		const { title, length_seconds: secs } = await getInfo(`https://youtu.be/${id[1]}`);

		if (!this.client.queue.has(msg.guild.id)) this.client.queue.set(msg.guild.id, this.DEFAULT);

		this.client.queue.get(msg.guild.id).songs.push({
			url: song,
			title: title,
			seconds: secs,
			requester: msg.author.username
		});

		return msg.send(`🎵 Added **${title}** to the queue 🎶`);
	}

};
