const { Command } = require('klasa');
const { get: fetch } = require('snekfetch');

const { API_KEYS } = require('../../../settings.json');

const fetchUrl = url => fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${url}&key=${API_KEYS.YOUTUBE_API}`).then(res => res.body);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			botPerms: ['USE_VAD', 'CONNECT'],
			description: 'Adds a song to the queue.',
			usage: '<song:str>'
		});

		this.regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;

		this.DEFAULT = {
			playing: false,
			songs: []
		};
	}

	async run(msg, [url]) {
		const youtubeURL = await this.getUrl(url);
		if (!youtubeURL) throw `❌ | ${msg.author}, video not found.`;

		const { music } = msg.guild;
		const song = await music.add(msg.author, youtubeURL);

		return msg.send(`🎵 | Added **${song.title}** to the queue 🎶`);
	}

	async getUrl(url) {
		const id = this.regExp.exec(url);
		if (id) return `https://youtu.be/${id[1]}`;
		const data = await fetchUrl(encodeURIComponent(url));
		const video = data.items.find(item => item.id.kind !== 'youtube#channel');

		return video ? `https://youtu.be/${video.id.videoId}` : null;
	}

};
