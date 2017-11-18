const { Command } = require('klasa');
const yt = require('ytdl-core');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Starts playing the first song in the queue.'
		});
	}

	async run(msg) {
		if (!this.client.queue.has(msg.guild.id)) {
			throw `❌ | ${msg.author}, there are no songs in the queue. Add some songs to the queue first with \`${msg.guild.settings.prefix}add <song:url>\`.`;
		} else if (!msg.guild.voiceConnection) {
			await this.client.commands.get('join').run(msg);
			return this.run(msg);
		}

		const handler = this.client.queue.get(msg.guild.id);
		if (handler.playing) throw `❌ | ${msg.author}, already playing.`;
		handler.playing = true;

		this.play(msg, handler, handler.songs[0]);

		const { dispatcher } = msg.guild.voiceConnection;
		return dispatcher.setVolume(0.3);
	}

	play(msg, handler, song) {
		if (!song) {
			return msg.send('⏹ | Queue is empty').then(() => {
				handler.playing = false;
				return msg.member.voiceChannel.leave();
			});
		}

		msg.send(`🎧 | Playing: **${song.title}** as requested by: **${song.requester}**`).catch(err => this.client.emit('log', err, 'error'));

		return msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: 2, volume: 0.3 })
			.on('end', () => {
				setTimeout(() => {
					handler.songs.shift();
					this.play(msg, handler, handler.songs[0]);
				}, 100);
			})
			.on('error', err => msg.send(`Error: ${err}`).then(() => {
				handler.songs.shift();
				this.play(msg, handler, handler.songs[0]);
			}));
	}

};
